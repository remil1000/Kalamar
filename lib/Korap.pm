package Korap;
use Mojo::Base 'Mojolicious';

our $VERSION = '0.04';

# Start dev with
# morbo -w lib -w templates -w public/sass -w public/js script/korap

# Start the application and register all routes and plugins
sub startup {
  my $self = shift;

  $self->defaults(layout => 'default');

  # Set secret for signed cookies
  $self->secrets(['fmhsfjgfchgsdbfgshfxztsbt32477eb45veu4vubrghfgghbtv']);

  # Add additional plugin path
  push(@{$self->plugins->namespaces}, __PACKAGE__ . '::Plugin');

  # Load plugins
  foreach (qw/Config
	      CHI
	      TagHelpers::Pagination
	      Notifications
	      Number::Commify
	      KorapSearch
	      KorapInfo
	      KorapTagHelpers
              /) {
    $self->plugin($_);
  };

  $self->plugin(AssetPack => {
    minify => 1
  });

  $self->plugin('AssetPack::LibSass');

  $self->asset(
    'korap.css' => (
      '/sass/style.scss',
      '/sass/sidebar.scss',
      '/sass/tutorial.scss',
      '/sass/hint.scss',
      '/sass/query.scss',
      '/sass/table.scss',
      '/sass/pagination.scss',
      '/sass/kwic-4.0.scss',
      '/css/media.css',
      '/css/font-awesome.min.css',
      '/css/highlight.css'
    )
  );

  $self->asset(
    'korap.js' => (
      '/js/jquery-2.0.0.min.js',
      '/js/translateTable.js',
      '/js/hint.js',
      '/js/highlight.pack.js'
    )
  );

  $self->helper(
    date_format => sub {
      my ($c, $date) = @_;
      return $date;
    }
  );

  # Routes
  my $r = $self->routes;

  # Base search route
  $r->get('/')->to('search#remote')->name('index');

  # Tutorial data
  $r->get('/tutorial/(*tutorial)', { tutorial => 'start' })
    ->to('tutorial#page')->name('tutorial');

  # Collection data
  my $collection = $r->bridge('/collection');
  $collection->to('info#about_collection');
  my $collection_id = $collection->bridge('/:collection_id');
  # stats
  # $collection_id->;
  $collection_id->search;

  # Corpus data
  my $corpus_res = $r->route('/corpus');
  my $corpus = $corpus_res->route('/:corpus_id');
  # Todo: Stats
  $corpus->search->name('search_corpus');
  my $doc = $corpus->route('/#doc_id');
  $doc->search->name('search_document');

  # Match data
  my $match = $doc->route('/:match_id');
  $match->route->to('info#about_match')->name('match');
  my $match_layer = $match->route('/:layer');
  $match_layer->route->to('info#about_match');
  $match_layer->route('/:foundry')->to('info#about_match');

  # Utilities
  # $r->get('/util/query')->to('search#query');
};


1;
