package Kalamar::Controller::Proxy;
use Mojo::Base 'Mojolicious::Controller';

# Pass proxy command to API
sub pass {
  my $c = shift;

  my $apiv = $c->stash('apiv');
  my $path = $c->stash('path') // '';

  # Get the original request
  my $req = $c->req;

  # Clone and clean request headers
  my $headers = $req->headers->clone->dehop;

  # Set Proxy information
  $headers->header('X-Proxy' => 'Kalamar');

  # Set clean X-Forwarded-For header
  $headers->header(
    'X-Forwarded-For' => $c->client_ip
  );

  # Get parameters of the request
  my $params = $req->query_params->clone;

  # Get API request for proxying
  my $url = Mojo::URL->new($c->korap->api($apiv))->path($path)->query($params);

  # Resend headers
  my $tx = $c->kalamar_ua->build_tx(
    $req->method => $url => $headers->to_hash => $req->body
  );

  # Pipe through system (which means
  # an authorization header may be set)
  $c->app->plugins->emit_hook(
    before_korap_request => ($c, $tx)
  );

  # Start proxy transaction and catch failure
  $c->proxy->start_p($tx)->catch(
    sub {
      my $err = shift;
      $c->render(
        text => "Proxy error: $err",
        status => 400
      );
    }
  )->finally(
    sub {
      $c->rendered;
    }
  )->wait;

  $tx->res->content->once(
    body => sub {
      my $headers = $c->res->headers;
      $headers->header('X-Proxy' => 'Kalamar');

      # Response is a redirect
      if ($c->res->is_redirect) {

        # Rewrite redirect location to surface URL
        my $location_url = $c->res->headers->location;
        my $base_url = Mojo::URL->new($c->korap->api)->to_abs->to_string;

        # Remove the api part
        # ".*?" is just required for non-absolute base_urls
        $location_url =~ s/^.*?${base_url}//;

        # Turn the rewritten location into a URL object
        $location_url = Mojo::URL->new($location_url);

        my $proxy_url = $c->url_for('proxy');
        $proxy_url->path->trailing_slash(1);

        # Rebase to proxy path
        my $loc_based = $location_url->base($proxy_url->to_abs);

        # Reset location
        $c->res->headers->location($loc_based->to_abs);
      };

      # Workaround for a proxy problem when
      # another proxy, e.g. Apache, manages multiple
      # connections
      $headers->connection('close');

      $c->app->plugins->emit_hook(after_render => $c);
    }
  );

  return 1;
};

1;
