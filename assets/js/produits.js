/* Rosalya — catalogue (textes repris du site WordPress d'origine) */
window.ROSALYA_CATEGORIES = {
  iconiques: {
    label: "Les iconiques",
    intro: "Notre sélection essentielle de best-sellers, qui incarnent notre philosophie du luxe simple. Des soins universels et hautement performants, indispensables à toute routine : efficacité, douceur et résultat visible."
  },
  cremes: {
    label: "Crèmes",
    intro: "Formulées pour sceller les bienfaits de vos sérums et apporter à votre peau le confort, l’hydratation et la protection dont elle a besoin. De la réparation intense à l’action anti-oxydante, des textures douces qui nourrissent tout en préservant l’équilibre et la souplesse cutanée."
  },
  serums: {
    label: "Sérums",
    intro: "Des concentrés d’actifs ciblés conçus pour traiter en profondeur les besoins spécifiques de votre peau : éclat, hydratation, pureté ou apaisement. Hautement concentrés, ils agissent comme des boosters et se glissent sous votre crème de jour ou de nuit."
  },
  "soins-specifiques": {
    label: "Soins spécifiques",
    intro: "Les produits qui complètent et perfectionnent votre routine quotidienne : du nettoyage fondamental aux huiles précieuses pour la nuit. Des formules précises pour équilibrer, revitaliser ou nourrir intensément votre peau."
  }
};

/* Étapes de routine : « du plus fin au plus riche » (FAQ Rosalya) */
window.ROSALYA_ETAPES = {
  1: "Nettoyer",
  2: "Tonifier",
  3: "Traiter",
  4: "Hydrater",
  5: "Nourrir",
  6: "Masque, 1 à 2 fois par semaine"
};

window.ROSALYA_PRODUITS = [
  {
    slug: "serum-purete",
    nom: "Sérum Pureté",
    actifs: "Niacinamide 5% + Zinc PCA",
    categorie: "serums",
    iconique: true,
    prix: 20.99,
    etape: 3,
    peau: "Peaux mixtes à grasses",
    resume: "Un sérum au fini aérien conçu pour apporter un aspect plus équilibré à la peau. La niacinamide aide à affiner visuellement le grain de peau tandis que le zinc PCA contribue à un aspect plus uniforme. Idéal pour les peaux sujettes aux brillances ou aux irrégularités.",
    utilisation: [
      "Ce Sérum Pureté est idéal pour les peaux mixtes à grasses ou sujettes aux imperfections.",
      "Appliquez 3 gouttes sur une peau propre et sèche matin et/ou soir. Ciblez particulièrement la zone T (front, nez, menton) si vous avez des brillances, ou les zones concernées par les pores dilatés et les boutons.",
      "La Niacinamide (vitamine B3) et le Zinc PCA travaillent ensemble pour réguler la production de sébum, minimiser l’apparence des pores et atténuer les rougeurs post-boutons. Si vous l’utilisez le matin, n’oubliez pas d’appliquer une protection solaire car certains ingrédients purifiants peuvent légèrement sensibiliser la peau aux UV."
    ],
    pourQui: "Les peaux mixtes à grasses, les peaux sujettes aux imperfections, aux pores dilatés, aux brillances et aux points noirs. Il est idéal pour équilibrer la production de sébum et améliorer le grain de peau."
  },
  {
    slug: "serum-hydratation",
    nom: "Sérum Hydratation",
    actifs: "Acide hyaluronique 2% + Eau de rose bio",
    categorie: "serums",
    iconique: true,
    prix: 19.5,
    etape: 3,
    peau: "Tous types de peaux déshydratées",
    resume: "Un sérum frais et léger qui aide la peau à retrouver douceur et souplesse. Sa texture fond instantanément et apporte une hydratation quotidienne tout en laissant le teint confortable et délicatement revitalisé.",
    utilisation: [
      "Pour maximiser les bienfaits de votre Sérum Hydratation, il est essentiel de l’appliquer sur une peau légèrement humide. L’acide hyaluronique agit comme une éponge et capte l’humidité présente à la surface de la peau pour mieux la retenir dans l’épiderme.",
      "Après avoir nettoyé et tonifié votre visage, vaporisez une brume d’eau florale ou laissez votre peau juste un peu mouillée avant de déposer 3 à 4 gouttes de sérum dans le creux de votre main. Répartissez-le sur l’ensemble du visage et du cou en tapotant doucement jusqu’à absorption complète.",
      "Terminez toujours l’application en scellant l’hydratation avec votre crème hydratante habituelle, matin et/ou soir."
    ],
    pourQui: "Toutes les personnes, quel que soit leur type de peau, qui cherchent à lutter contre la déshydratation (peau qui tiraille, manque de souplesse, ridules de déshydratation). Il est parfait en base pour maintenir un bon niveau d’eau dans la peau."
  },
  {
    slug: "serum-apaisant",
    nom: "Sérum Apaisant",
    actifs: "Centella asiatica + Camomille blanche",
    categorie: "serums",
    iconique: false,
    prix: 19.2,
    etape: 3,
    peau: "Peaux sensibles et réactives",
    resume: "Un sérum doux formulé pour offrir confort et sérénité aux peaux sensibles. La centella asiatica et la camomille blanche enveloppent la peau d’une sensation calmante et réconfortante.",
    utilisation: [
      "Ce sérum est le parfait allié des peaux sensibles, réactives, ou irritées.",
      "Appliquez 2 à 3 gouttes le matin et/ou le soir, après le nettoyage, sur une peau propre. Massez doucement du bout des doigts, avec des mouvements légers, en insistant sur les zones de rougeurs ou d’inconfort.",
      "La Centella asiatica favorise la réparation et la cicatrisation, tandis que la camomille blanche calme immédiatement les sensations d’échauffement ou les tiraillements. Ce sérum peut également être utilisé ponctuellement comme un « soin SOS » après une exposition au soleil ou lorsque votre barrière cutanée a été fragilisée."
    ],
    pourQui: "Les peaux sensibles, réactives, facilement irritées, qui présentent des rougeurs diffuses ou localisées, ou qui ont besoin d’aide pour la réparation cutanée (par exemple après une irritation ou une exposition aux facteurs externes)."
  },
  {
    slug: "serum-fermete",
    nom: "Sérum Fermeté",
    actifs: "Peptides biomimétiques + Extrait de lotus",
    categorie: "serums",
    iconique: false,
    prix: 25,
    etape: 3,
    peau: "Peaux matures",
    resume: "Un soin ciblé à la texture fluide, pensé pour apporter un aspect plus tonique et lisse à la peau. Les peptides biomimétiques et le lotus offrent une sensation de renouveau et d’élasticité.",
    utilisation: [
      "Le Sérum Fermeté est conçu pour améliorer l’élasticité et la densité de la peau. Utilisez-le idéalement le soir pour profiter du cycle de régénération nocturne de la peau.",
      "Après le nettoyage, déposez 3 à 4 gouttes et massez par mouvements ascendants, du cou vers le front. Concentrez-vous sur les zones où la perte de fermeté est la plus visible, comme l’ovale du visage et le cou.",
      "L’action des peptides biomimétiques aide à stimuler la production de collagène. Pour un effet lifting accentué, pincez légèrement la peau tout en appliquant le sérum pour améliorer la pénétration et stimuler la microcirculation."
    ],
    pourQui: "Les peaux matures ou toute personne cherchant à prévenir ou à traiter les signes de l’âge liés à la perte de structure : manque de fermeté, relâchement de l’ovale du visage, et perte d’élasticité et de densité cutanée."
  },
  {
    slug: "creme-hydratante",
    nom: "Crème Hydratante",
    actifs: "Beurre de karité + Acide hyaluronique",
    categorie: "cremes",
    iconique: true,
    prix: 23.99,
    etape: 4,
    peau: "Peaux normales à sèches",
    resume: "Le soin essentiel pour une hydratation durable. Sa formule associe l’effet repulpant de l’Acide hyaluronique au confort nourrissant du Beurre de karité, laissant la peau souple et protégée toute la journée.",
    utilisation: [
      "Après votre sérum, prélevez une noisette de crème et réchauffez-la entre vos mains. Appliquez-la matin et/ou soir sur le visage et le cou par des mouvements légers et ascendants.",
      "Le Beurre de karité apporte le confort nourrissant tandis que l’Acide hyaluronique maintient l’eau dans l’épiderme.",
      "Elle constitue également une excellente base de maquillage."
    ],
    pourQui: "Cette crème est l’alliée de tous les types de peaux, mais elle est particulièrement bénéfique pour les peaux normales à sèches et celles qui cherchent une hydratation durable et confortable, sans sensation de gras. Elle est essentielle pour maintenir le film hydrolipidique."
  },
  {
    slug: "creme-reparatrice",
    nom: "Crème Réparatrice",
    actifs: "Céramides + Avoine colloïdale",
    categorie: "cremes",
    iconique: false,
    prix: 29.99,
    etape: 4,
    peau: "Peaux sèches et fragilisées",
    resume: "La solution SOS pour la barrière cutanée. Enrichie en Céramides pour réparer et en Avoine colloïdale pour apaiser, cette crème restaure les peaux fragilisées, sèches et réactives, offrant un confort immédiat.",
    utilisation: [
      "Utilisez cette crème matin et soir, ou de manière ponctuelle lorsque votre peau est en détresse.",
      "Appliquez une couche généreuse sur les zones sèches et irritées. Les Céramides aident à restructurer la barrière de la peau, tandis que l’Avoine colloïdale apaise immédiatement.",
      "Massez très délicatement pour ne pas irriter davantage la peau."
    ],
    pourQui: "Idéale pour les peaux sèches à très sèches, les peaux sensibles et réactives, ou celles dont la barrière cutanée est fragilisée (tiraillements, irritations, rougeurs dues aux agressions externes). C’est un soin SOS pour restaurer le confort et la protection."
  },
  {
    slug: "creme-anti-oxydante",
    nom: "Crème Anti-Oxydante",
    actifs: "Thé vert + Vitamine E",
    categorie: "cremes",
    iconique: false,
    prix: 20.99,
    etape: 4,
    peau: "Peaux exposées à la pollution",
    resume: "Le bouclier quotidien contre le stress environnemental. Ce puissant cocktail de Thé vert et de Vitamine E combat les radicaux libres, aidant à prévenir les signes prématurés du vieillissement et à protéger la peau de la pollution.",
    utilisation: [
      "Utilisez cette crème tous les matins pour créer un bouclier protecteur. Déposez une noisette sur le visage et le cou.",
      "Le Thé vert et la Vitamine E sont de puissants antioxydants qui neutralisent les agressions extérieures. Complétez toujours par une protection solaire si vous vous exposez directement aux UV."
    ],
    pourQui: "Parfaite pour tous les types de peaux vivant en milieu urbain ou étant fréquemment exposées à la pollution et aux facteurs de stress environnemental. C’est le soin préventif idéal contre le vieillissement prématuré lié aux radicaux libres."
  },
  {
    slug: "creme-eclat-subtil",
    nom: "Crème Éclat Subtil",
    actifs: "Vitamine B3 + Extrait de pivoine",
    categorie: "cremes",
    iconique: false,
    prix: 19.5,
    etape: 4,
    peau: "Teints ternes ou irréguliers",
    resume: "Révélez un teint uniforme et lumineux. La Vitamine B3 (Niacinamide) agit pour réduire l’apparence des pores, tandis que l’Extrait de pivoine sublime l’éclat, pour une peau visiblement plus nette et douce.",
    utilisation: [
      "Appliquez-la de préférence le matin après votre sérum pour profiter de ses propriétés illuminatrices tout au long de la journée.",
      "La Vitamine B3 (Niacinamide) travaille sur l’uniformité du teint et la texture de la peau. Massez jusqu’à absorption complète pour un fini subtilement lumineux et velouté."
    ],
    pourQui: "Conçue pour toutes les peaux, mais surtout celles qui manquent de luminosité, qui présentent un teint irrégulier ou des taches pigmentaires naissantes. Elle est également très appréciée par les peaux mixtes pour son effet équilibrant (grâce à la Vitamine B3)."
  },
  {
    slug: "gel-nettoyant-doux",
    nom: "Gel Nettoyant Doux",
    actifs: "Aloe vera + Glycérine végétale",
    categorie: "soins-specifiques",
    iconique: true,
    nouveau: true,
    prix: 23.5,
    etape: 1,
    peau: "Tous types de peaux",
    resume: "Le geste essentiel pour une peau propre et apaisée. Ce gel doux élimine impuretés et maquillage sans dessécher, grâce à l’Aloe vera calmant et à la Glycérine végétale hydratante.",
    utilisation: [
      "Appliquez une noisette de gel matin et soir sur le visage et le cou humides. Massez délicatement en mouvements circulaires, puis rincez abondamment à l’eau tiède.",
      "Il prépare idéalement la peau à recevoir les sérums."
    ],
    pourQui: "Idéal pour tous les types de peaux, y compris les peaux sensibles et déshydratées. Il est essentiel pour ceux qui cherchent un nettoyage efficace qui respecte le film hydrolipidique de la peau."
  },
  {
    slug: "lotion-equilibrante",
    nom: "Lotion Équilibrante",
    actifs: "Eau florale d’hamamélis + Niacinamide",
    categorie: "soins-specifiques",
    iconique: false,
    prix: 17.99,
    etape: 2,
    peau: "Pores dilatés, grain de peau irrégulier",
    resume: "Le soin parfait pour affiner le grain de peau. La Niacinamide équilibre et la puissante Eau florale d’hamamélis resserre les pores et complète le nettoyage en douceur.",
    utilisation: [
      "Après le nettoyage, versez quelques gouttes sur un coton réutilisable ou dans la paume de vos mains.",
      "Tamponnez délicatement sur l’ensemble du visage en évitant le contour des yeux. Utilisation matin et/ou soir."
    ],
    pourQui: "Le soin parfait pour affiner le grain de peau. La Niacinamide équilibre et la puissante Eau florale d’hamamélis resserre les pores et complète le nettoyage en douceur."
  },
  {
    slug: "masque-revitalisant",
    nom: "Masque Crème Revitalisant",
    actifs: "Argile rose + Extrait de framboise",
    categorie: "soins-specifiques",
    iconique: false,
    prix: 31.5,
    etape: 6,
    peau: "Peaux ternes ou fatiguées",
    resume: "Un bain de lumière pour la peau. L’Argile rose purifie en douceur, tandis que l’Extrait de framboise revitalise et illumine instantanément le teint, offrant un effet bonne mine immédiat.",
    utilisation: [
      "Appliquez une couche moyenne sur peau propre et sèche, en évitant le contour des yeux. Laissez poser 10 à 15 minutes.",
      "Rincez à l’eau tiède. Utilisez 1 à 2 fois par semaine, suivi de votre sérum et crème."
    ],
    pourQui: "Adapté à toutes les peaux, y compris les peaux ternes, fatiguées ou sensibles, qui ont besoin d’un coup d’éclat et d’une purification très douce sans dessèchement."
  },
  {
    slug: "huile-regenerante",
    nom: "Huile Régénérante",
    actifs: "Rose musquée + Vitamine E",
    categorie: "soins-specifiques",
    iconique: false,
    prix: 25.5,
    etape: 5,
    peau: "Peaux matures ou sèches",
    resume: "Le soin précieux pour une peau renouvelée. L’Huile de Rose musquée aide à estomper les signes du temps et améliore la régénération, soutenue par la Vitamine E antioxydante. Pour une peau souple et visiblement plus lumineuse au réveil.",
    utilisation: [
      "Appliquez 3 à 4 gouttes le soir, comme dernière étape de votre rituel (après les crèmes). Massez doucement par mouvements ascendants sur le visage et le cou.",
      "Elle peut également être mélangée à votre crème de nuit pour un boost nourrissant."
    ],
    pourQui: "Idéale pour les peaux matures, les peaux sèches ou en manque de vitalité et d’éclat. Elle est particulièrement recommandée pour l’atténuation des cicatrices et pour les soins anti-âge nocturnes."
  },
  {
    slug: "huile-apaisante",
    nom: "Huile Apaisante",
    actifs: "Calendula + Camomille",
    categorie: "soins-specifiques",
    iconique: false,
    prix: 20.99,
    etape: 5,
    peau: "Peaux sensibles, sujettes aux rougeurs",
    resume: "L’enveloppe de douceur pour les peaux délicates. Les extraits de Calendula et de Camomille travaillent en synergie pour calmer instantanément les irritations et réduire les rougeurs, restaurant le confort et la sérénité de la peau.",
    utilisation: [
      "Utilisez-la matin et/ou soir, en déposant 2 à 3 gouttes dans la paume des mains. Chauffez légèrement puis appliquez par légers tapotements sur les zones irritées ou sur l’ensemble du visage.",
      "Elle est parfaite pour un massage réconfortant avant le coucher."
    ],
    pourQui: "Conçue spécifiquement pour les peaux sensibles, irritées, réactives ou sujettes aux rougeurs. Elle apporte un confort immédiat et aide à réduire les inflammations cutanées."
  }
];
