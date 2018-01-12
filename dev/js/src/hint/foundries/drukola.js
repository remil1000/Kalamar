define(["hint/foundries"], function (ah) {
  ah["-"].push(
    ["DRuKoLa", "drukola/", "Lemma, Morphology, Part-of-Speech"]
  );

  ah["drukola/"] = [
    ["Lemma", "l="],
    ["Morphology", "m="],
    ["Part-of-Speech", "p="]      
  ];

  ah["drukola/m="] =  [
    ["CTAG", "ctag:"]
  ];

  ah["drukola/m=ctag:"] = [
    ["A","A ","Adjective"],
    ["Y","Y ","Abbreviation"],
    ["AN","AN ","Adjective, Indefinite"],
    ["APRY","APRY ","Adjective, Plural, Direct, Definite"],
    ["APN","APN ","Adjective, Plural, Indefinite"],
    ["APOY","APOY ","Adjective, Plural, Oblique, Definite"],
    ["APON","APON ","Adjective, Plural, Oblique, Indefinite"],
    ["ASRY","ASRY ","Adjective, Singular, Direct, Definite"],
    ["ASN","ASN ","Adjective, Singular, Indefinite"],
    ["ASOY","ASOY ","Adjective, Singular, Oblique, Definite"],
    ["ASON","ASON ","Adjective, Singular, Oblique, Indefinite"],
    ["ASVY","ASVY ","Adjective, Singular, Vocative, Definite"],
    ["ASVN","ASVN ","Adjective, Singular, Vocative, Indefinite"],
    ["R","R ","Adverb"],
    ["RC","RC ","Adverb, Portmanteau"],
    ["TS","TS ","Article, Definite or Possessive, Singular"],
    ["TP","TP ","Article, Indefinite or Possessive, Plural"],
    ["TPR","TPR ","Article, non-Possessive, Plural, Direct"],
    ["TPO","TPO ","Article, non-Possessive, Plural, Oblique"],
    ["TSR","TSR ","Article, non-Possessive, Singular, Direct"],
    ["TSO","TSO ","Article, non-Possessive, Singular, Oblique"],
    ["NPRY","NPRY ","Common Noun, Plural, Direct, Definite"],
    ["NPN","NPN ","Common Noun, Plural, Indefinite"],
    ["NPOY","NPOY ","Common Noun, Plural, Oblique, Definite"],
    ["NPVY","NPVY ","Common Noun, Plural, Vocative, Definite"],
    ["NN","NN ","Common Noun, singular"],
    ["NSY","NSY ","Common Noun, Singular, Definite"],
    ["NSRY","NSRY ","Common Noun, Singular, Direct, Definite"],
    ["NSRN","NSRN ","Common Noun, Singular, Direct, Indefinite"],
    ["NSN","NSN ","Common Noun, Singular, Indefinite"],
    ["NSOY","NSOY ","Common Noun, Singular, Oblique, Definite"],
    ["NSON","NSON ","Common Noun, Singular, Oblique, Indefinite"],
    ["NSVY","NSVY ","Common Noun, Singular, Vocative, Definite"],
    ["NSVN","NSVN ","Common Noun, Singular, Vocative, Indefinite"],
    ["CR","CR ","Conjunctio, portmanteau"],
    ["C","C ","Conjunction"],
    ["QF","QF ","Future Particle"],
    ["QN","QN ","Infinitival Particle"],
    ["I","I ","Interjection"],
    ["QZ","QZ ","Negative Particle"],
    ["M","M ","Numeral"],
    ["PP","PP ","Personal Pronoun"],
    ["PPP","PPP ","Personal Pronoun, Plural"],
    ["PPPA","PPPA ","Personal Pronoun, Plural, Acc."],
    ["PPPD","PPPD ","Personal Pronoun, Plural, Dative"],
    ["PPPR","PPPR ","Personal Pronoun, Plural, Direct"],
    ["PPPO","PPPO ","Personal Pronoun, Plural, Oblique"],
    ["PPS","PPS ","Personal Pronoun, Singular"],
    ["PPSA","PPSA ","Personal Pronoun, Singular, Accusative"],
    ["PPSD","PPSD ","Personal Pronoun, Singular, Dative"],
    ["PPSR","PPSR ","Personal Pronoun, Singular, Direct"],
    ["PPSN","PPSN ","Personal Pronoun, Singular, Nominative"],
    ["PPSO","PPSO ","Personal Pronoun, Singular, Oblique"],
    ["S","S ","Preposition"],
    ["DMPR","DMPR ","Pronoun or Determiner, Demonstrative, Plural, Direct"],
    ["DMPO","DMPO ","Pronoun or Determiner, Demonstrative, Plural, Oblique"],
    ["DMSR","DMSR ","Pronoun or Determiner, Demonstrative, Singular, Direct"],
    ["DMSO","DMSO ","Pronoun or Determiner, Demonstrative, Singular, Oblique"],
    ["PS","PS ","Pronoun or Determiner, Poss or Emph"],
    ["PSS","PSS ","Pronoun or Determiner, Poss or Emph, Singular"],
    ["RELR","RELR ","Pronoun or Determiner, Relative, Direct"],
    ["RELO","RELO ","Pronoun or Determiner, Relative, Oblique"],
    ["NP","NP ","Proper Noun"],
    ["PI","PI ","Quantifier Pronoun or Determiner"],
    ["PXA","PXA ","Reflexive Pronoun, Accusative"],
    ["PXD","PXD ","Reflexive Pronoun, Dative"],
    ["X","X ","Residual"],
    ["QS","QS ","Subjunctive Particle"],
    ["VA","VA ","Verb, Auxiliary"],
    ["VA1","VA1 ","Verb, Auxiliary, 1st person"],
    ["VA2P","VA2P ","Verb, Auxiliary, 2nd person, Plural"],
    ["VA2S","VA2S ","Verb, Auxiliary, 2nd person, Singular"],
    ["VA3","VA3 ","Verb, Auxiliary, 3rd person"],
    ["VA3P","VA3P ","Verb, Auxiliary, 3rd person, Plural"],
    ["VA3S","VA3S ","Verb, Auxiliary, 3rd person, Singular"],
    ["VA1P","VA1P ","Verb, Auxiliary,1st person, Plural"],
    ["VA1S","VA1S ","Verb, Auxiliary,1st person, Singular"],
    ["VG","VG ","Verb, Gerund"],
    ["VN","VN ","Verb, Infinitive"],
    ["V1","V1 ","Verb, Main, 1st person"],
    ["V2","V2 ","Verb, Main, 2nd person"],
    ["V3","V3 ","Verb, Main, 3rd person"],
    ["VPPF","VPPF ","Verb, Participle, Plural, Feminine"],
    ["VPPM","VPPM ","Verb, Participle, Plural, Masculine"],
    ["VPSF","VPSF ","Verb, Participle, Singular, Feminine"],
    ["VPSM","VPSM ","Verb, Participle, Singular, Masculine"]
  ];

});