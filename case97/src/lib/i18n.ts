import { defaultLocale, locales, type AppLocale } from './locales'

export const isLocale = (v: string): v is AppLocale => (locales as readonly string[]).includes(v)
export const toLocale = (v: string | undefined): AppLocale => (v && isLocale(v) ? v : defaultLocale)

const en = {
  nav: { stories: 'Stories', haunted: 'Haunted', history: 'History', legends: 'Legends', unsolved: 'Unsolved', guides: 'Field guides', signIn: 'Sign in', account: 'Account', premium: 'Go Premium', menu: 'Menu', language: 'Language' },
  themes: { haunted: 'Haunted', chronicle: 'History', mystery: 'Unsolved', folklore: 'Legend', fieldGuide: 'Field guide' },
  common: { caseNo: 'Case No.', minRead: 'min read', creepiness: 'Creepiness', ad: 'Advertisement', allStories: 'All stories', back: 'Back' },
  home: {
    read: 'Read the case', listen: 'Listen', latest: 'Latest cases', viewAll: 'See every story',
    mapTitle: 'Every story has a place', mapBody: 'Each case is pinned to a real location you can visit, with directions from Google Maps.', mapCta: 'Browse the places',
    premiumTitle: 'Listen on the road. Read without ads.', premiumBody: 'Every story narrated in English, French, Spanish and Bengali, with downloads for flights and train rides.', premiumCta: 'See Premium',
    empty: 'No stories are published yet. Add one in the admin panel.',
  },
  story: {
    book: 'Book', scroll: 'Scroll', prev: 'Previous page', next: 'Next page', pages: 'Pages', of: 'of',
    save: 'Save', saved: 'Saved', signInToSave: 'Sign in to save stories',
    listen: 'Listen', listenPremium: 'Listen with Premium',
    where: 'Where it is', directions: 'Get directions', related: 'More cases',
    lockedTitle: 'The rest of this case is for Premium readers', lockedBody: 'Unlock every story, ad-free reading and narration in four languages.', lockedCta: 'See Premium',
    readingMode: 'Reading mode', chapter: 'Chapter',
    readIn: 'Read in', notTranslated: 'Not translated yet', fallbackNotice: 'This story isn’t translated into this language yet, so you’re reading the English version.',
  },
  auth: {
    registerTitle: 'Who’s looking back?', registerIntro: 'Create your account to save stories, follow places and pick up where you stopped.',
    name: 'Your name', email: 'Email', password: 'Password', show: 'Show', hide: 'Hide', language: 'Reading language',
    terms: 'I accept the terms and privacy policy', register: 'Step into the mirror', haveAccount: 'Already have an account?',
    checkEmailTitle: 'It sees you now.', checkEmailBody: 'We sent a confirmation link to your email. Open it to activate your account.',
    loginTitle: 'Welcome back', loginIntro: 'Sign in to your Case97 account.', login: 'Sign in', noAccount: 'New here?', createOne: 'Create an account', forgot: 'Forgot password?',
    forgotTitle: 'Reset your password', forgotIntro: 'Enter your email and we’ll send you a reset link.', sendLink: 'Send reset link', linkSent: 'If that email has an account, a reset link is on its way.',
    resetTitle: 'Choose a new password', newPassword: 'New password', savePassword: 'Save password', passwordSaved: 'Password saved. You’re signed in.',
    verifyTitle: 'Confirming your email', verifying: 'One moment…', verified: 'Your email is confirmed. You can sign in now.', verifyFailed: 'This link has expired or was already used. Try signing in, or register again.',
    errGeneric: 'Something went wrong. Check your connection and try again.', errEmailTaken: 'An account with this email already exists. Sign in instead.',
    errLogin: 'Email or password is incorrect.', errUnverified: 'Confirm your email first. Check your inbox for the link.', errPassword: 'Use at least 8 characters.',
    errLocked: 'Too many attempts. Wait 10 minutes and try again.',
  },
  account: {
    title: 'Your account', wishlist: 'Saved stories', emptyWishlist: 'Nothing saved yet. Tap Save on any story to keep it here.',
    plan: 'Plan', free: 'Free reader', premium: 'Premium', renews: 'Renews on', endsOn: 'Access until', signOut: 'Sign out', upgrade: 'Go Premium', remove: 'Remove',
  },
  premium: {
    title: 'Case97 Premium', intro: 'For readers who want the whole archive, without interruptions.',
    features: ['No ads anywhere on the site', 'Audio narration in English, French, Spanish and Bengali', 'Download stories to listen offline', 'Premium-only cases'],
    india: 'in India', intl: 'in the US and Europe', perMonth: '/ month',
    payIndia: 'Pay with UPI AutoPay through Google Pay, PhonePe or Paytm, or with a card.', payIntl: 'Pay with Google Pay, Apple Pay, card or PayPal. Cancel anytime.',
    cta: 'Start Premium', soon: 'Checkout opens soon. Create a free account now and you’ll be first to know.', signInFirst: 'Create a free account first',
  },
  footer: { tagline: 'Real stories of historical and haunted places.', about: 'About', privacy: 'Privacy', terms: 'Terms', discord: 'Join the Discord', follow: 'Follow' },
}

export type Dict = typeof en

const fr: Dict = {
  nav: { stories: 'Histoires', haunted: 'Hantés', history: 'Histoire', legends: 'Légendes', unsolved: 'Énigmes', guides: 'Guides', signIn: 'Connexion', account: 'Compte', premium: 'Passer Premium', menu: 'Menu', language: 'Langue' },
  themes: { haunted: 'Hanté', chronicle: 'Histoire', mystery: 'Énigme', folklore: 'Légende', fieldGuide: 'Guide' },
  common: { caseNo: 'Dossier n°', minRead: 'min de lecture', creepiness: 'Frisson', ad: 'Publicité', allStories: 'Toutes les histoires', back: 'Retour' },
  home: {
    read: 'Lire le dossier', listen: 'Écouter', latest: 'Derniers dossiers', viewAll: 'Voir toutes les histoires',
    mapTitle: 'Chaque histoire a son lieu', mapBody: 'Chaque dossier est lié à un lieu réel à visiter, avec l’itinéraire Google Maps.', mapCta: 'Parcourir les lieux',
    premiumTitle: 'Écoutez en voyage. Lisez sans publicité.', premiumBody: 'Chaque histoire racontée en anglais, français, espagnol et bengali, à télécharger pour l’avion ou le train.', premiumCta: 'Découvrir Premium',
    empty: 'Aucune histoire publiée pour l’instant.',
  },
  story: {
    book: 'Livre', scroll: 'Défilement', prev: 'Page précédente', next: 'Page suivante', pages: 'Pages', of: 'sur',
    save: 'Enregistrer', saved: 'Enregistré', signInToSave: 'Connectez-vous pour enregistrer',
    listen: 'Écouter', listenPremium: 'Écouter avec Premium',
    where: 'Où se trouve-t-il', directions: 'Itinéraire', related: 'Autres dossiers',
    lockedTitle: 'La suite de ce dossier est réservée aux lecteurs Premium', lockedBody: 'Débloquez toutes les histoires, la lecture sans publicité et la narration en quatre langues.', lockedCta: 'Découvrir Premium',
    readingMode: 'Mode de lecture', chapter: 'Chapitre',
    readIn: 'Lire en', notTranslated: 'Pas encore traduit', fallbackNotice: 'Cette histoire n’est pas encore traduite dans cette langue : vous lisez la version anglaise.',
  },
  auth: {
    registerTitle: 'Qui vous regarde ?', registerIntro: 'Créez votre compte pour enregistrer des histoires et reprendre là où vous vous êtes arrêté.',
    name: 'Votre nom', email: 'E-mail', password: 'Mot de passe', show: 'Afficher', hide: 'Masquer', language: 'Langue de lecture',
    terms: 'J’accepte les conditions et la politique de confidentialité', register: 'Entrer dans le miroir', haveAccount: 'Déjà un compte ?',
    checkEmailTitle: 'Il vous voit maintenant.', checkEmailBody: 'Nous avons envoyé un lien de confirmation à votre adresse. Ouvrez-le pour activer votre compte.',
    loginTitle: 'Bon retour', loginIntro: 'Connectez-vous à votre compte Case97.', login: 'Se connecter', noAccount: 'Nouveau ?', createOne: 'Créer un compte', forgot: 'Mot de passe oublié ?',
    forgotTitle: 'Réinitialiser le mot de passe', forgotIntro: 'Saisissez votre e-mail pour recevoir un lien.', sendLink: 'Envoyer le lien', linkSent: 'Si un compte existe pour cet e-mail, le lien est en route.',
    resetTitle: 'Nouveau mot de passe', newPassword: 'Nouveau mot de passe', savePassword: 'Enregistrer', passwordSaved: 'Mot de passe enregistré. Vous êtes connecté.',
    verifyTitle: 'Confirmation de votre e-mail', verifying: 'Un instant…', verified: 'Votre e-mail est confirmé. Vous pouvez vous connecter.', verifyFailed: 'Ce lien a expiré ou a déjà servi. Essayez de vous connecter.',
    errGeneric: 'Une erreur est survenue. Vérifiez votre connexion et réessayez.', errEmailTaken: 'Un compte existe déjà avec cet e-mail. Connectez-vous.',
    errLogin: 'E-mail ou mot de passe incorrect.', errUnverified: 'Confirmez d’abord votre e-mail grâce au lien reçu.', errPassword: 'Utilisez au moins 8 caractères.',
    errLocked: 'Trop de tentatives. Réessayez dans 10 minutes.',
  },
  account: {
    title: 'Votre compte', wishlist: 'Histoires enregistrées', emptyWishlist: 'Rien d’enregistré. Appuyez sur Enregistrer dans une histoire.',
    plan: 'Formule', free: 'Lecteur gratuit', premium: 'Premium', renews: 'Renouvellement le', endsOn: 'Accès jusqu’au', signOut: 'Se déconnecter', upgrade: 'Passer Premium', remove: 'Retirer',
  },
  premium: {
    title: 'Case97 Premium', intro: 'Pour les lecteurs qui veulent toute l’archive, sans interruption.',
    features: ['Aucune publicité', 'Narration audio en anglais, français, espagnol et bengali', 'Téléchargement pour l’écoute hors ligne', 'Dossiers réservés Premium'],
    india: 'en Inde', intl: 'aux États-Unis et en Europe', perMonth: '/ mois',
    payIndia: 'Paiement par UPI AutoPay (Google Pay, PhonePe, Paytm) ou par carte.', payIntl: 'Paiement par Google Pay, Apple Pay, carte ou PayPal. Résiliable à tout moment.',
    cta: 'Démarrer Premium', soon: 'Le paiement ouvre bientôt. Créez un compte gratuit pour être prévenu.', signInFirst: 'Créer d’abord un compte gratuit',
  },
  footer: { tagline: 'Histoires vraies de lieux historiques et hantés.', about: 'À propos', privacy: 'Confidentialité', terms: 'Conditions', discord: 'Rejoindre le Discord', follow: 'Suivre' },
}

const es: Dict = {
  nav: { stories: 'Historias', haunted: 'Embrujados', history: 'Historia', legends: 'Leyendas', unsolved: 'Misterios', guides: 'Guías', signIn: 'Entrar', account: 'Cuenta', premium: 'Hazte Premium', menu: 'Menú', language: 'Idioma' },
  themes: { haunted: 'Embrujado', chronicle: 'Historia', mystery: 'Misterio', folklore: 'Leyenda', fieldGuide: 'Guía' },
  common: { caseNo: 'Caso n.º', minRead: 'min de lectura', creepiness: 'Escalofrío', ad: 'Publicidad', allStories: 'Todas las historias', back: 'Volver' },
  home: {
    read: 'Leer el caso', listen: 'Escuchar', latest: 'Últimos casos', viewAll: 'Ver todas las historias',
    mapTitle: 'Cada historia tiene un lugar', mapBody: 'Cada caso está ligado a un lugar real que puedes visitar, con indicaciones de Google Maps.', mapCta: 'Explorar los lugares',
    premiumTitle: 'Escucha de viaje. Lee sin anuncios.', premiumBody: 'Cada historia narrada en inglés, francés, español y bengalí, con descargas para el avión o el tren.', premiumCta: 'Ver Premium',
    empty: 'Todavía no hay historias publicadas.',
  },
  story: {
    book: 'Libro', scroll: 'Desplazar', prev: 'Página anterior', next: 'Página siguiente', pages: 'Páginas', of: 'de',
    save: 'Guardar', saved: 'Guardado', signInToSave: 'Entra para guardar historias',
    listen: 'Escuchar', listenPremium: 'Escuchar con Premium',
    where: 'Dónde está', directions: 'Cómo llegar', related: 'Más casos',
    lockedTitle: 'El resto de este caso es para lectores Premium', lockedBody: 'Desbloquea todas las historias, lectura sin anuncios y narración en cuatro idiomas.', lockedCta: 'Ver Premium',
    readingMode: 'Modo de lectura', chapter: 'Capítulo',
    readIn: 'Leer en', notTranslated: 'Aún sin traducir', fallbackNotice: 'Esta historia aún no está traducida a este idioma, así que estás leyendo la versión en inglés.',
  },
  auth: {
    registerTitle: '¿Quién te devuelve la mirada?', registerIntro: 'Crea tu cuenta para guardar historias y seguir donde lo dejaste.',
    name: 'Tu nombre', email: 'Correo', password: 'Contraseña', show: 'Mostrar', hide: 'Ocultar', language: 'Idioma de lectura',
    terms: 'Acepto los términos y la política de privacidad', register: 'Entrar en el espejo', haveAccount: '¿Ya tienes cuenta?',
    checkEmailTitle: 'Ahora te ve.', checkEmailBody: 'Te enviamos un enlace de confirmación. Ábrelo para activar tu cuenta.',
    loginTitle: 'Bienvenido de nuevo', loginIntro: 'Entra en tu cuenta de Case97.', login: 'Entrar', noAccount: '¿Eres nuevo?', createOne: 'Crear una cuenta', forgot: '¿Olvidaste la contraseña?',
    forgotTitle: 'Restablecer contraseña', forgotIntro: 'Escribe tu correo y te enviaremos un enlace.', sendLink: 'Enviar enlace', linkSent: 'Si ese correo tiene cuenta, el enlace va en camino.',
    resetTitle: 'Elige una contraseña nueva', newPassword: 'Contraseña nueva', savePassword: 'Guardar contraseña', passwordSaved: 'Contraseña guardada. Ya has entrado.',
    verifyTitle: 'Confirmando tu correo', verifying: 'Un momento…', verified: 'Tu correo está confirmado. Ya puedes entrar.', verifyFailed: 'Este enlace caducó o ya se usó. Intenta entrar.',
    errGeneric: 'Algo falló. Revisa tu conexión e inténtalo de nuevo.', errEmailTaken: 'Ya existe una cuenta con este correo. Entra con ella.',
    errLogin: 'Correo o contraseña incorrectos.', errUnverified: 'Primero confirma tu correo con el enlace que te enviamos.', errPassword: 'Usa al menos 8 caracteres.',
    errLocked: 'Demasiados intentos. Espera 10 minutos.',
  },
  account: {
    title: 'Tu cuenta', wishlist: 'Historias guardadas', emptyWishlist: 'Aún no has guardado nada. Pulsa Guardar en cualquier historia.',
    plan: 'Plan', free: 'Lector gratuito', premium: 'Premium', renews: 'Se renueva el', endsOn: 'Acceso hasta', signOut: 'Salir', upgrade: 'Hazte Premium', remove: 'Quitar',
  },
  premium: {
    title: 'Case97 Premium', intro: 'Para lectores que quieren todo el archivo, sin interrupciones.',
    features: ['Sin anuncios', 'Narración en inglés, francés, español y bengalí', 'Descargas para escuchar sin conexión', 'Casos exclusivos Premium'],
    india: 'en India', intl: 'en EE. UU. y Europa', perMonth: '/ mes',
    payIndia: 'Paga con UPI AutoPay (Google Pay, PhonePe, Paytm) o con tarjeta.', payIntl: 'Paga con Google Pay, Apple Pay, tarjeta o PayPal. Cancela cuando quieras.',
    cta: 'Empezar Premium', soon: 'El pago abre pronto. Crea una cuenta gratis y te avisaremos.', signInFirst: 'Crea primero una cuenta gratis',
  },
  footer: { tagline: 'Historias reales de lugares históricos y embrujados.', about: 'Acerca de', privacy: 'Privacidad', terms: 'Términos', discord: 'Únete al Discord', follow: 'Síguenos' },
}

const bn: Dict = {
  nav: { stories: 'গল্প', haunted: 'ভৌতিক', history: 'ইতিহাস', legends: 'লোককথা', unsolved: 'রহস্য', guides: 'ভ্রমণ গাইড', signIn: 'সাইন ইন', account: 'অ্যাকাউন্ট', premium: 'প্রিমিয়াম নিন', menu: 'মেনু', language: 'ভাষা' },
  themes: { haunted: 'ভৌতিক', chronicle: 'ইতিহাস', mystery: 'রহস্য', folklore: 'লোককথা', fieldGuide: 'ভ্রমণ গাইড' },
  common: { caseNo: 'কেস নং', minRead: 'মিনিট পড়া', creepiness: 'ভয়ের মাত্রা', ad: 'বিজ্ঞাপন', allStories: 'সব গল্প', back: 'ফিরে যান' },
  home: {
    read: 'কেসটি পড়ুন', listen: 'শুনুন', latest: 'সাম্প্রতিক কেস', viewAll: 'সব গল্প দেখুন',
    mapTitle: 'প্রতিটি গল্পের একটি জায়গা আছে', mapBody: 'প্রতিটি কেস একটি সত্যিকারের জায়গার সঙ্গে যুক্ত, গুগল ম্যাপসের দিকনির্দেশ সহ।', mapCta: 'জায়গাগুলো দেখুন',
    premiumTitle: 'পথে শুনুন। বিজ্ঞাপন ছাড়া পড়ুন।', premiumBody: 'প্রতিটি গল্প ইংরেজি, ফরাসি, স্প্যানিশ ও বাংলায় বর্ণনা করা, বিমান বা ট্রেনের জন্য ডাউনলোড সহ।', premiumCta: 'প্রিমিয়াম দেখুন',
    empty: 'এখনও কোনো গল্প প্রকাশিত হয়নি।',
  },
  story: {
    book: 'বই', scroll: 'স্ক্রল', prev: 'আগের পাতা', next: 'পরের পাতা', pages: 'পাতা', of: '/',
    save: 'সংরক্ষণ', saved: 'সংরক্ষিত', signInToSave: 'গল্প সংরক্ষণ করতে সাইন ইন করুন',
    listen: 'শুনুন', listenPremium: 'প্রিমিয়ামে শুনুন',
    where: 'কোথায় অবস্থিত', directions: 'দিকনির্দেশ', related: 'আরও কেস',
    lockedTitle: 'এই কেসের বাকি অংশ প্রিমিয়াম পাঠকদের জন্য', lockedBody: 'সব গল্প, বিজ্ঞাপনহীন পড়া আর চার ভাষায় অডিও বর্ণনা আনলক করুন।', lockedCta: 'প্রিমিয়াম দেখুন',
    readingMode: 'পড়ার ধরন', chapter: 'অধ্যায়',
    readIn: 'পড়ুন', notTranslated: 'এখনও অনুবাদ হয়নি', fallbackNotice: 'এই গল্পটি এখনও এই ভাষায় অনুবাদ করা হয়নি, তাই আপনি ইংরেজি সংস্করণ পড়ছেন।',
  },
  auth: {
    registerTitle: 'কে তাকিয়ে আছে?', registerIntro: 'গল্প সংরক্ষণ করতে আর যেখানে থেমেছিলেন সেখান থেকে পড়তে অ্যাকাউন্ট খুলুন।',
    name: 'আপনার নাম', email: 'ইমেল', password: 'পাসওয়ার্ড', show: 'দেখান', hide: 'লুকান', language: 'পড়ার ভাষা',
    terms: 'আমি শর্তাবলি ও গোপনীয়তা নীতি মেনে নিচ্ছি', register: 'আয়নার ভিতরে আসুন', haveAccount: 'আগে থেকেই অ্যাকাউন্ট আছে?',
    checkEmailTitle: 'এখন সে আপনাকে দেখছে।', checkEmailBody: 'আপনার ইমেলে একটি নিশ্চিতকরণ লিংক পাঠানো হয়েছে। অ্যাকাউন্ট চালু করতে সেটি খুলুন।',
    loginTitle: 'আবার স্বাগতম', loginIntro: 'আপনার Case97 অ্যাকাউন্টে সাইন ইন করুন।', login: 'সাইন ইন', noAccount: 'নতুন?', createOne: 'অ্যাকাউন্ট খুলুন', forgot: 'পাসওয়ার্ড ভুলে গেছেন?',
    forgotTitle: 'পাসওয়ার্ড রিসেট', forgotIntro: 'ইমেল দিন, আমরা রিসেট লিংক পাঠাব।', sendLink: 'লিংক পাঠান', linkSent: 'এই ইমেলে অ্যাকাউন্ট থাকলে রিসেট লিংক পাঠানো হয়েছে।',
    resetTitle: 'নতুন পাসওয়ার্ড বেছে নিন', newPassword: 'নতুন পাসওয়ার্ড', savePassword: 'পাসওয়ার্ড সংরক্ষণ', passwordSaved: 'পাসওয়ার্ড সংরক্ষিত। আপনি সাইন ইন করেছেন।',
    verifyTitle: 'ইমেল নিশ্চিত করা হচ্ছে', verifying: 'একটু অপেক্ষা করুন…', verified: 'আপনার ইমেল নিশ্চিত হয়েছে। এখন সাইন ইন করতে পারেন।', verifyFailed: 'লিংকটির মেয়াদ শেষ বা আগেই ব্যবহার হয়েছে। সাইন ইন করে দেখুন।',
    errGeneric: 'কিছু একটা ভুল হয়েছে। সংযোগ দেখে আবার চেষ্টা করুন।', errEmailTaken: 'এই ইমেলে আগেই অ্যাকাউন্ট আছে। সাইন ইন করুন।',
    errLogin: 'ইমেল বা পাসওয়ার্ড ভুল।', errUnverified: 'আগে ইমেলের লিংক থেকে অ্যাকাউন্ট নিশ্চিত করুন।', errPassword: 'অন্তত ৮টি অক্ষর ব্যবহার করুন।',
    errLocked: 'অনেকবার চেষ্টা হয়েছে। ১০ মিনিট পরে আবার চেষ্টা করুন।',
  },
  account: {
    title: 'আপনার অ্যাকাউন্ট', wishlist: 'সংরক্ষিত গল্প', emptyWishlist: 'এখনও কিছু সংরক্ষণ করেননি। যেকোনো গল্পে সংরক্ষণ চাপুন।',
    plan: 'প্ল্যান', free: 'ফ্রি পাঠক', premium: 'প্রিমিয়াম', renews: 'নবীকরণ', endsOn: 'অ্যাক্সেস থাকবে', signOut: 'সাইন আউট', upgrade: 'প্রিমিয়াম নিন', remove: 'সরান',
  },
  premium: {
    title: 'Case97 প্রিমিয়াম', intro: 'যাঁরা পুরো আর্কাইভ বিনা বাধায় চান, তাঁদের জন্য।',
    features: ['কোথাও কোনো বিজ্ঞাপন নেই', 'ইংরেজি, ফরাসি, স্প্যানিশ ও বাংলায় অডিও বর্ণনা', 'অফলাইনে শোনার জন্য ডাউনলোড', 'শুধু প্রিমিয়ামের কেস'],
    india: 'ভারতে', intl: 'আমেরিকা ও ইউরোপে', perMonth: '/ মাস',
    payIndia: 'Google Pay, PhonePe বা Paytm-এ UPI AutoPay দিয়ে, অথবা কার্ডে পেমেন্ট করুন।', payIntl: 'Google Pay, Apple Pay, কার্ড বা PayPal দিয়ে পেমেন্ট। যেকোনো সময় বাতিল করা যায়।',
    cta: 'প্রিমিয়াম শুরু করুন', soon: 'পেমেন্ট শীঘ্রই চালু হবে। এখনই ফ্রি অ্যাকাউন্ট খুলুন, আমরা জানিয়ে দেব।', signInFirst: 'আগে ফ্রি অ্যাকাউন্ট খুলুন',
  },
  footer: { tagline: 'ঐতিহাসিক ও ভৌতিক জায়গার সত্যি গল্প।', about: 'আমাদের কথা', privacy: 'গোপনীয়তা', terms: 'শর্তাবলি', discord: 'Discord-এ যোগ দিন', follow: 'অনুসরণ করুন' },
}

const dictionaries: Record<AppLocale, Dict> = { en, fr, es, bn }
export const getDict = (locale: AppLocale): Dict => dictionaries[locale]

// Bengali digits for case numbers and counts.
const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
export const formatNumber = (n: number | string, locale: AppLocale, pad = 0) => {
  const s = String(n).padStart(pad, '0')
  return locale === 'bn' ? s.replace(/\d/g, (d) => bnDigits[Number(d)]) : s
}

export const formatDate = (iso: string, locale: AppLocale) =>
  new Date(iso).toLocaleDateString(locale === 'bn' ? 'bn-IN' : locale, { day: 'numeric', month: 'long', year: 'numeric' })
