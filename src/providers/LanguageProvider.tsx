"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'en' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Common
    'common.welcome': 'Welcome',
    'common.logout': 'Logout',
    'common.login': 'Login',
    'common.register': 'Register',
    'common.home': 'Home',
    'common.search': 'Search',
    'common.profile': 'Profile',
    'common.dashboard': 'Dashboard',
    'common.help': 'Help',
    'common.about': 'About',
    'common.contact': 'Contact',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.close': 'Close',
    'common.apply': 'Apply',
    'common.clear': 'Clear',
    'common.filter': 'Filter',
    'common.admin': 'Admin',
    
    // Site Name
    'site.name': 'AV Tamil Matrimony',
    'site.tagline': 'திருமண சேவை',
    'site.tagline.full': 'Find Your Perfect Match',
    
    // Header
    'header.how.it.works': 'How It Works',
    'header.about.us': 'About Us',
    'header.success.stories': 'Success Stories',
    
    // Home Page
    'home.hero.title': 'Find Your Perfect Life Partner',
    'home.hero.subtitle': 'Trusted Tamil Matrimony Service',
    'home.hero.description': 'Join thousands of happy couples who found their soulmate through our platform',
    'home.cta.get.started': 'Get Started Free',
    'home.cta.login': 'Already a Member? Login',
    'home.stats.members': 'Active Members',
    'home.stats.matches': 'Successful Matches',
    'home.stats.locations': 'Cities Covered',
    'home.features.title': 'Why Choose Us',
    'home.features.verified': 'Verified Profiles',
    'home.features.verified.desc': 'All profiles are manually verified for authenticity',
    'home.features.privacy': 'Privacy First',
    'home.features.privacy.desc': 'Your contact details are protected and shared only with your permission',
    'home.features.matching': 'Smart Matching',
    'home.features.matching.desc': 'Advanced algorithms to find compatible matches',
    'home.features.support': '24/7 Support',
    'home.features.support.desc': 'Dedicated support team to help you find your match',
    'home.how.it.works.title': 'How It Works',
    'home.how.step1': 'Create Profile',
    'home.how.step1.desc': 'Sign up and create your detailed profile',
    'home.how.step2': 'Search Matches',
    'home.how.step2.desc': 'Browse through verified profiles',
    'home.how.step3': 'Connect',
    'home.how.step3.desc': 'Express interest and start your journey',
    'home.footer.copyright': '© 2026 AV Tamil Matrimony. All rights reserved.',
    
    // Home Page - Additional
    'active_profiles': 'Active Profiles',
    'success_stories': 'Success Stories',
    'verified_profiles': 'Verified Profiles',
    'family_centered_approach': 'Family-Centered Approach',
    'family_centered_description': 'We understand that marriage is about families, not just individuals. Every connection honors tradition and family values.',
    'verified_profiles_only': 'Verified Profiles Only',
    'verified_profiles_description': 'Every profile is personally verified by our team before going live. No fake accounts, only genuine people.',
    'tamil_community_focus': 'Tamil Community Focus',
    'tamil_community_description': 'Serving Tamil communities across India and abroad, with deep respect for Tamil culture and traditions.',
    'no_games_just_genuine_connections': 'No Games, Just Genuine Connections',
    'no_games_description': 'No algorithm tricks. No swipe culture. Just honest profiles and meaningful connections that lead to marriage.',
    'story_1_quote': 'We found each other through AV Tamil Matrimony. The verification process gave our families confidence.',
    'story_2_quote': 'Simple, respectful, and effective. No unnecessary features, just what matters for finding a life partner.',
    'story_3_quote': 'Being abroad, it was important to find someone who understood both cultures. AV helped us connect meaningfully.',
    
    // Login Page
    'login.title': 'Welcome Back',
    'login.subtitle': 'Login to your account',
    'login.email': 'Email Address',
    'login.password': 'Password',
    'login.remember': 'Remember me',
    'login.forgot': 'Forgot Password?',
    'login.no.account': "Don't have an account?",
    'login.register.now': 'Register Now',
    'login.email.required': 'Email is required',
    'login.password.required': 'Password is required',
    'login.success': 'Login successful!',
    'login.error': 'Invalid credentials. Please try again.',
    
    // Register Page
    'register.title': 'Create Your Profile',
    'register.subtitle': 'Join thousands of happy couples',
    'register.full.name': 'Full Name',
    'register.email': 'Email Address',
    'register.phone': 'Phone Number',
    'register.password': 'Password',
    'register.confirm.password': 'Confirm Password',
    'register.gender': 'Gender',
    'register.gender.male': 'Male',
    'register.gender.female': 'Female',
    'register.dob': 'Date of Birth',
    'register.have.account': 'Already have an account?',
    'register.login.now': 'Login Now',
    'register.success': 'Registration successful!',
    'register.passwords.mismatch': 'Passwords do not match',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.view.profile': 'View Profile',
    'dashboard.edit.profile': 'Edit Profile',
    'dashboard.search.profiles': 'Search Profiles',
    'dashboard.my.interests': 'My Interests',
    'dashboard.manage.interests': 'Manage Interests',
    'dashboard.interested.in.you': 'People Interested In You',
    'dashboard.your.interests': 'Your Interests',
    'dashboard.your.activity': 'Your Activity',
    'dashboard.profile.views': 'Profile Views',
    'dashboard.interests.sent': 'Interests Sent',
    'dashboard.interests.received': 'Interests Received',
    'dashboard.matches': 'Matches',
    'dashboard.recent.matches': 'Recent Matches',
    'dashboard.new': 'New',
    'dashboard.interested.label': 'Interested in you',
    'dashboard.view.profile.btn': 'View Profile',
    
    // Profile Search
    'search.title': 'Find Your Match',
    'search.showing.results': 'Showing {count} Profiles',
    'search.no.results': 'No profiles found',
    'search.filter.age.range': 'AGE RANGE',
    'search.filter.min.age': 'Min Age',
    'search.filter.max.age': 'Max Age',
    'search.filter.height': 'HEIGHT',
    'search.filter.caste': 'CASTE',
    'search.filter.location': 'LOCATION',
    'search.apply.filters': 'Apply Filters',
    'search.clear.filters': 'Clear All Filters',
    'search.years': 'years',
    'search.filters.applied': 'Filters applied successfully',
    'search.filters.cleared': 'All filters cleared',
    
    // Profile View
    'profile.age': 'Age',
    'profile.height': 'Height',
    'profile.occupation': 'Occupation',
    'profile.education': 'Education',
    'profile.income': 'Income',
    'profile.location': 'Location',
    'profile.caste': 'Caste',
    'profile.interests': 'Interests',
    'profile.about': 'About',
    'profile.express.interest': 'Express Interest',
    'profile.contact.admin': 'Contact Admin for Details',
    'profile.back': 'Back to Search',
    
    // Admin
    'admin.login': 'Admin Login',
    'admin.portal': 'Admin Portal',
    'admin.dashboard': 'Admin Dashboard',
    'admin.username': 'Username',
    'admin.password': 'Password',
    'admin.secure.login': 'Secure Login',
    'admin.demo.credentials': 'Demo Credentials',
    'admin.back.to.user.login': '← Back to User Login',
    'admin.login.success': 'Admin login successful.',
    'admin.access.denied': 'Access denied: administrator privileges required.',
    
    // Help Center
    'help.title': 'Help Center',
    'help.faq': 'Frequently Asked Questions',
    'help.contact': 'Contact Support',
    'help.report': 'Report User',
    'help.back.to.home': 'Back to Home',
    'help.support': 'Help & Support',
    'help.send.message': 'Send us a message',
    'help.your.name': 'Your Name',
    'help.email': 'Email',
    'help.subject': 'Subject',
    'help.message': 'Message',
    'help.submit.ticket': 'Submit Ticket',
    'help.phone': 'Phone',
    'help.hours': 'Hours',
    'help.hours.value': 'Mon-Sat: 9 AM - 6 PM',
    'help.response.time': 'Response Time',
    'help.response.time.desc': 'We typically respond to all inquiries within 24 hours during business days.',
    'help.report.title': 'Report a User',
    'help.report.desc': 'If you\'ve encountered a suspicious or inappropriate profile, please report it to us. All reports are confidential.',
    'help.profile.id': 'Profile ID to Report',
    'help.reason': 'Reason for Report',
    'help.select.reason': 'Select a reason',
    'help.reason.fake': 'Fake Profile / False Information',
    'help.reason.inappropriate': 'Inappropriate Behavior',
    'help.reason.harassment': 'Harassment',
    'help.reason.scam': 'Suspected Scam',
    'help.reason.other': 'Other',
    'help.additional.details': 'Additional Details',
    'help.submit.report': 'Submit Report',
    
    // Login Page - Additional
    'login.back.to.home': 'Back to home',
    'login.welcome.back': 'Welcome back to AV Tamil Matrimony',
    'login.logging.in': 'Logging in...',
    'login.no.account.text': 'Don\'t have an account?',
    'login.register.here': 'Register here',
    
    // Register Page - Additional
    'register.back.to.home': 'Back to home',
    'register.back.to.previous': 'Back to previous step',
    'register.step.of': 'Step {step} of 3',
    'register.profile.for': 'This profile is for',
    'register.select': 'Select',
    'register.self': 'Self',
    'register.son': 'Son',
    'register.daughter': 'Daughter',
    'register.brother': 'Brother',
    'register.sister': 'Sister',
    'register.friend': 'Friend',
    'register.relative': 'Relative',
    'register.community': 'Community',
    'register.height': 'Height',
    'register.marital.status': 'Marital Status',
    'register.never.married': 'Never Married',
    'register.divorced': 'Divorced',
    'register.widowed': 'Widowed',
    'register.education': 'Education',
    'register.occupation': 'Occupation',
    'register.annual.income': 'Annual Income',
    'register.city': 'City',
    'register.state': 'State',
    'register.caste': 'Caste',
    'register.continue': 'Continue',
    'register.create.profile': 'Create Profile',
    'register.creating.profile': 'Creating profile...',

    // HowItWorks Page
    'howitworks.badge': 'HOW IT WORKS',
    'howitworks.title': 'Your Journey to Forever',
    'howitworks.subtitle': 'Four simple steps to find your perfect life partner',
    'howitworks.step.of': 'STEP {num} OF 4',
    'howitworks.step1.title': 'Create Your Profile',
    'howitworks.step1.desc': 'Share your story with verified details, preferences, and family background. Our secure platform ensures your privacy while helping you connect with compatible matches.',
    'howitworks.step2.title': 'Discover Matches',
    'howitworks.step2.desc': 'Browse verified profiles and send respectful interest requests at your own pace.',
    'howitworks.step3.title': 'Connect & Communicate',
    'howitworks.step3.desc': 'When interest is mutual, start meaningful conversations with families.',
    'howitworks.step4.title': 'Begin Your Journey',
    'howitworks.step4.desc': 'Connect with families, meet in person, and take the journey toward marriage together.',
    'howitworks.cta.title': 'Ready to Begin Your Journey?',
    'howitworks.cta.desc': 'Join thousands of Tamil families who found their perfect match through AV Matrimony',
    'howitworks.cta.button': 'Create Your Profile Today',

    // About Page
    'about.title': 'About AV Tamil Matrimony',
    'about.desc': 'Founded in 2015, AV Tamil Matrimony has been connecting Tamil families worldwide, helping thousands find their perfect life partners through traditional values and modern technology.',
    'about.mission.badge': 'OUR MISSION',
    'about.mission.title': 'Bringing Families Together',
    'about.values.title': 'Why Choose AV Tamil Matrimony',
    'about.values.subtitle': 'Built on values that matter to Tamil families',
    'about.journey.title': 'Our Journey',
    'about.journey.subtitle': 'Over a decade of helping families find happiness',
    'about.cta.title': 'Join Our Community',
    'about.cta.desc': 'Be part of thousands of families who trusted us with their most important decision',
    'about.cta.button': 'Create Your Profile Today',

    // Stories Page
    'stories.title': 'Success Stories',
    'stories.desc': 'Real stories from real couples who found their perfect life partners through AV Tamil Matrimony. Their happiness is our greatest achievement.',
    'stories.successful.marriages': 'Successful Marriages',
    'stories.countries.connected': 'Countries Connected',
    'stories.happy.families': 'Happy Families',
    'stories.testimonials.title': 'What Families Say',
    'stories.testimonials.subtitle': 'Hear from the families who trusted us',
    'stories.cta.title': 'Your Story Could Be Next',
    'stories.cta.desc': 'Join thousands of happy couples who found their life partners through AV Tamil Matrimony',
    'stories.cta.button': 'Create Your Profile',
    'stories.cta.learn': 'Learn How It Works',

    // Footer
    'footer.about.us': 'About Us',
    'footer.about.av': 'About AV Matrimony',
    'footer.services': 'Services',
    'footer.search.profiles': 'Search Profiles',
    'footer.support': 'Support',
    'footer.help.center': 'Help Center',
    'footer.contact.us': 'Contact Us',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.copyright': '© 2026 AV Tamil Matrimony. All rights reserved.',

    // Admin Login
    'admin.portal.title': 'Admin Portal',
    'admin.site.name': 'AV Tamil Matrimony',
    'admin.login.to.panel': 'Login to Admin Panel',
    'admin.security.notice': 'This is a secure admin area. All activities are logged.',

    // Toast Messages
    'toast.logout.success': 'Logged out successfully!',
    'toast.login.success': 'Welcome back!',
    'toast.register.success': 'Registration successful! Welcome!',
    'toast.profile.updated': 'Profile updated successfully!',
    'toast.interest.sent': 'Interest sent successfully!',
    'toast.please.login': 'Please login to access this page',
  },
  ta: {
    // Common
    'common.welcome': 'வரவேற்கிறோம்',
    'common.logout': 'வெளியேறு',
    'common.login': 'உள்நுழைய',
    'common.register': 'பதிவு செய்ய',
    'common.home': 'முகப்பு',
    'common.search': 'தேடல்',
    'common.profile': 'சுயவிவரம்',
    'common.dashboard': 'முகப்புப் பலகை',
    'common.help': 'உதவி',
    'common.about': 'எங்களை பற்றி',
    'common.contact': 'தொடர்பு',
    'common.submit': 'சமர்ப்பிக்கவும்',
    'common.cancel': 'ரத்து செய்',
    'common.save': 'சேமி',
    'common.edit': 'திருத்து',
    'common.delete': 'நீக்கு',
    'common.view': 'காண்க',
    'common.close': 'மூடு',
    'common.apply': 'பயன்படுத்து',
    'common.clear': 'அழி',
    'common.filter': 'வடிகட்டி',
    'common.admin': 'நிர்வாகி',
    
    // Site Name
    'site.name': 'ஏ.வி தமிழ் மேட்ரிமோனி',
    'site.tagline': 'திருமண சேவை',
    'site.tagline.full': 'உங்கள் சரியான ஜோடியை கண்டறியவும்',
    
    // Header
    'header.how.it.works': 'எப்படி வேலை செய்கிறது',
    'header.about.us': 'எங்களைப் பற்றி',
    'header.success.stories': 'வெற்றிக் கதைகள்',
    
    // Home Page
    'home.hero.title': 'உங்கள் வாழ்க்கைத் துணையைக் கண்டறியவும்',
    'home.hero.subtitle': 'நம்பகமான தமிழ் திருமண சேவை',
    'home.hero.description': 'எங்கள் தளத்தின் மூலம் தங்கள் ஆத்ம துணையைக் கண்டறிந்த ஆயிரக்கணக்கான மகிழ்ச்சியான ஜோடிகளுடன் இணையுங்கள்',
    'home.cta.get.started': 'இலவசமாக தொடங்கவும்',
    'home.cta.login': 'ஏற்கனவே உறுப்பினரா? உள்நுழையவும்',
    'home.stats.members': 'செயலில் உள்ள உறுப்பினர்கள்',
    'home.stats.matches': 'வெற்றிகரமான இணைப்புகள்',
    'home.stats.locations': 'நகரங்கள்',
    'home.features.title': 'எங்களை ஏன் தேர்வு செய்ய வேண்டும்',
    'home.features.verified': 'சரிபார்க்கப்பட்ட சுயவிவரங்கள்',
    'home.features.verified.desc': 'அனைத்து சுயவிவரங்களும் நம்பகத்தன்மைக்காக கைமுறையாக சரிபார்க்கப்படுகின்றன',
    'home.features.privacy': 'தனியுரிமை முதலில்',
    'home.features.privacy.desc': 'உங்கள் தொடர்பு விவரங்கள் பாதுகாக்கப்படுகின்றன மற்றும் உங்கள் அனுமதியுடன் மட்டுமே பகிரப்படும்',
    'home.features.matching': 'ஸ்மார்ட் பொருத்தம்',
    'home.features.matching.desc': 'இணக்கமான பொருத்தங்களைக் கண்டறிய மேம்பட்ட வழிமுறைகள்',
    'home.features.support': '24/7 ஆதரவு',
    'home.features.support.desc': 'உங்கள் பொருத்தத்தைக் கண்டறிய உதவும் அர்ப்பணிப்பு குழு',
    'home.how.it.works.title': 'எப்படி வேலை செய்கிறது',
    'home.how.step1': 'சுயவிவரம் உருவாக்கவும்',
    'home.how.step1.desc': 'பதிவு செய்து உங்கள் விரிவான சுயவிவரத்தை உருவாக்கவும்',
    'home.how.step2': 'பொருத்தங்களைத் தேடுங்கள்',
    'home.how.step2.desc': 'சரிபார்க்கப்பட்ட சுயவிவரங்களை உலாவவும்',
    'home.how.step3': 'இணைக்கவும்',
    'home.how.step3.desc': 'ஆர்வத்தை வெளிப்படுத்தி உங்கள் பயணத்தைத் தொடங்குங்கள்',
    'home.footer.copyright': '© 2026 ஏ.வி தமிழ் மேட்ரிமோனி. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    
    // Home Page - Additional
    'active_profiles': 'செயலில் உள்ள சுயவிவரங்கள்',
    'success_stories': 'வெற்றிக் கதைகள்',
    'verified_profiles': 'சரிபார்க்கப்பட்ட சுயவிவரங்கள்',
    'family_centered_approach': 'குடும்ப-மையப்படுத்தப்பட்ட அணுகுமுறை',
    'family_centered_description': 'திருமணம் தனிநபர்களைப் பற்றியது மட்டுமல்ல, குடும்பங்களைப் பற்றியது என்பதை நாங்கள் புரிந்துகொள்கிறோம். ஒவ்வொரு இணைப்பும் பாரம்பரியத்தையும் குடும்ப மதிப்புகளையும் மதிக்கிறது.',
    'verified_profiles_only': 'சரிபார்க்கப்பட்ட சுயவிவரங்கள் மட்டும்',
    'verified_profiles_description': 'ஒவ்வொரு சுயவிவரமும் நேரலையில் செல்வதற்கு முன்பு எங்கள் குழுவால் தனிப்பட்ட முறையில் சரிபார்க்கப்படுகிறது. போலி கணக்குகள் இல்லை, உண்மையான நபர்கள் மட்டுமே.',
    'tamil_community_focus': 'தமிழ் சமூக கவனம்',
    'tamil_community_description': 'இந்தியா மற்றும் வெளிநாடுகளில் உள்ள தமிழ் சமூகங்களுக்கு சேவை செய்கிறோம், தமிழ் கலாச்சாரம் மற்றும் பாரம்பரியங்களுக்கு ஆழ்ந்த மரியாதையுடன்.',
    'no_games_just_genuine_connections': 'விளையாட்டுகள் இல்லை, உண்மையான இணைப்புகள் மட்டுமே',
    'no_games_description': 'அல்காரிதம் தந்திரங்கள் இல்லை. ஸ்வைப் கலாச்சாரம் இல்லை. நேர்மையான சுயவிவரங்கள் மற்றும் திருமணத்திற்கு வழிவகுக்கும் அர்த்தமுள்ள இணைப்புகள் மட்டுமே.',
    'story_1_quote': 'நாங்கள் ஏ.வி தமிழ் மேட்ரிமோனி மூலம் ஒருவரையொருவர் கண்டுபிடித்தோம். சரிபார்ப்பு செயல்முறை எங்கள் குடும்பங்களுக்கு நம்பிக்கையை அளித்தது.',
    'story_2_quote': 'எளிமையானது, மரியாதைக்குரியது மற்றும் பயனுள்ளது. தேவையற்ற அம்சங்கள் இல்லை, வாழ்க்கைத் துணையைக் கண்டுபிடிப்பதற்கு முக்கியமானது மட்டுமே.',
    'story_3_quote': 'வெளிநாட்டில் இருப்பதால், இரண்டு கலாச்சாரங்களையும் புரிந்துகொள்ளும் ஒருவரைக் கண்டுபிடிப்பது முக்கியமானது. ஏ.வி எங்களுக்கு அர்த்தமுள்ள முறையில் இணைக்க உதவியது.',
    
    // Login Page
    'login.title': 'மீண்டும் வரவேற்கிறோம்',
    'login.subtitle': 'உங்கள் கணக்கில் உள்நுழையவும்',
    'login.email': 'மின்னஞ்சல் முகவரி',
    'login.password': 'கடவுச்சொல்',
    'login.remember': 'என்னை நினைவில் கொள்',
    'login.forgot': 'கடவுச்சொல்லை மறந்துவிட்டீர்களா?',
    'login.no.account': 'கணக்கு இல்லையா?',
    'login.register.now': 'இப்போதே பதிவு செய்யவும்',
    'login.email.required': 'மின்னஞ்சல் தேவை',
    'login.password.required': 'கடவுச்சொல் தேவை',
    'login.success': 'உள்நுழைவு வெற்றிகரமாக!',
    'login.error': 'தவறான நற்சான்றிதழ்கள். மீண்டும் முயற்சிக்கவும்.',
    
    // Register Page
    'register.title': 'உங்கள் சுயவிவரத்தை உருவாக்கவும்',
    'register.subtitle': 'ஆயிரக்கணக்கான மகிழ்ச்சியான ஜோடிகளுடன் இணையுங்கள்',
    'register.full.name': 'முழு பெயர்',
    'register.email': 'மின்னஞ்சல் முகவரி',
    'register.phone': 'தொலைபேசி எண்',
    'register.password': 'கடவுச்சொல்',
    'register.confirm.password': 'கடவுச்சொல்லை உறுதிப்படுத்தவும்',
    'register.gender': 'பாலினம்',
    'register.gender.male': 'ஆண்',
    'register.gender.female': 'பெண்',
    'register.dob': 'பிறந்த தேதி',
    'register.have.account': 'ஏற்கனவே கணக்கு உள்ளதா?',
    'register.login.now': 'இப்போது உள்நுழையவும்',
    'register.success': 'பதிவு வெற்றிகரமாக!',
    'register.passwords.mismatch': 'கடவுச்சொற்கள் பொருந்தவில்லை',
    
    // Dashboard
    'dashboard.title': 'முகப்புப் பலகை',
    'dashboard.view.profile': 'சுயவிவரத்தைப் பார்க்கவும்',
    'dashboard.edit.profile': 'சுயவிவரத்தைத் திருத்தவும்',
    'dashboard.search.profiles': 'சுயவிவரங்களைத் தேடவும்',
    'dashboard.my.interests': 'எனது ஆர்வங்கள்',
    'dashboard.manage.interests': 'ஆர்வங்களை நிர்வகிக்கவும்',
    'dashboard.interested.in.you': 'உங்களில் ஆர்வமுள்ளவர்கள்',
    'dashboard.your.interests': 'உங்கள் ஆர்வங்கள்',
    'dashboard.your.activity': 'உங்கள் செயல்பாடு',
    'dashboard.profile.views': 'சுயவிவர காட்சிகள்',
    'dashboard.interests.sent': 'அனுப்பிய ஆர்வங்கள்',
    'dashboard.interests.received': 'பெற்ற ஆர்வங்கள்',
    'dashboard.matches': 'பொருத்தங்கள்',
    'dashboard.recent.matches': 'சமீபத்திய பொருத்தங்கள்',
    'dashboard.new': 'புதிய',
    'dashboard.interested.label': 'உங்களில் ஆர்வம்',
    'dashboard.view.profile.btn': 'சுயவிவரத்தைப் பார்க்கவும்',
    
    // Profile Search
    'search.title': 'உங்கள் பொருத்தத்தைக் கண்டறியவும்',
    'search.showing.results': '{count} சுயவிவரங்களைக் காட்டுகிறது',
    'search.no.results': 'சுயவிவரங்கள் இல்லை',
    'search.filter.age.range': 'வயது வரம்பு',
    'search.filter.min.age': 'குறைந்த வயது',
    'search.filter.max.age': 'அதிக வயது',
    'search.filter.height': 'உயரம்',
    'search.filter.caste': 'ஜாதி',
    'search.filter.location': 'இடம்',
    'search.apply.filters': 'வடிகட்டிகளைப் பயன்படுத்தவும்',
    'search.clear.filters': 'அனைத்து வடிகட்டிகளையும் அழிக்கவும்',
    'search.years': 'ஆண்டுகள்',
    'search.filters.applied': 'வடிகட்டிகள் வெற்றிகரமாக பயன்படுத்தப்பட்டன',
    'search.filters.cleared': 'அனைத்து வடிகட்டிகளும் அழிக்கப்பட்டன',
    
    // Profile View
    'profile.age': 'வயது',
    'profile.height': 'உயரம்',
    'profile.occupation': 'தொழில்',
    'profile.education': 'கல்வி',
    'profile.income': 'வருமானம்',
    'profile.location': 'இடம்',
    'profile.caste': 'ஜாதி',
    'profile.interests': 'ஆர்வங்கள்',
    'profile.about': 'பற்றி',
    'profile.express.interest': 'ஆர்வத்தை வெளிப்படுத்தவும்',
    'profile.contact.admin': 'விவரங்களுக்கு நிர்வாகியைத் தொடர்பு கொள்ளவும்',
    'profile.back': 'தேடலுக்குத் திரும்பு',
    
    // Admin
    'admin.login': 'நிர்வாகி உள்நுழைவு',
    'admin.portal': 'நிர்வாகி போர்ட்டல்',
    'admin.dashboard': 'நிர்வாகி முகப்புப் பலகை',
    'admin.username': 'பயனர்பெயர்',
    'admin.password': 'கடவுச்சொல்',
    'admin.secure.login': 'பாதுகாப்பான உள்நுழைவு',
    'admin.demo.credentials': 'டெமோ நற்சான்றிதழ்கள்',
    'admin.back.to.user.login': '← பயனர் உள்நுழைவுக்கு திரும்பு',
    'admin.login.success': 'நிர்வாகி உள்நுழைவு வெற்றிகரமாக முடிந்தது.',
    'admin.access.denied': '⛔ அணுகல் மறுக்கப்பட்டது: நிர்வாகி சிறப்புரிமைகள் தேவை',
    
    // Help Center
    'help.title': 'உதவி மையம்',
    'help.faq': 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
    'help.contact': 'ஆதரவைத் தொடர்பு கொள்ளவும்',
    'help.report': 'பயனரை அறிக்கையிடு',
    'help.back.to.home': 'முகப்புக்கு திரும்பு',
    'help.support': 'உதவி & ஆதரவு',
    'help.send.message': 'நாம் க்கு ஒரு செய்தி அனுப்பு',
    'help.your.name': 'உங்கள் பெயர்',
    'help.email': 'மின்னஞ்சல்',
    'help.subject': 'தலைப்பு',
    'help.message': 'செய்தி',
    'help.submit.ticket': 'தோற்று அனுப்பு',
    'help.phone': 'தொலைபேசி',
    'help.hours': 'மணிக்குறிகள்',
    'help.hours.value': 'திருவிழா-சனிவாரம்: 9 AM - 6 PM',
    'help.response.time': 'பதில் காலம்',
    'help.response.time.desc': 'நம்முடன் அனைத்து கேள்விகளும் வித்தியாச நாட்களில் 24 மணிக்குறிகளில் பதில் கொடுக்கப்படுகின்றன.',
    'help.report.title': 'பயனரை அறிக்கையிடு',
    'help.report.desc': 'ஒரு அதிகாரமற்ற அல்லது அவசரமற்ற சுயவிவரத்தைக் கண்டுபிடித்தால், நம்முக்கு அறிக்கையிடுக. அனைத்து அறிக்கைகளும் முறையாக உள்ளன.',
    'help.profile.id': 'அறிக்கையிடுவதற்கான சுயவிவர ஐடி',
    'help.reason': 'அறிக்கையிடுவதற்கான காரணம்',
    'help.select.reason': 'ஒரு காரணம் தெரியுங்கள்',
    'help.reason.fake': 'பொய்ய சுயவிவரம் / தவறான தகவல்',
    'help.reason.inappropriate': 'அதிகாரமற்ற நடவடிக்கை',
    'help.reason.harassment': 'துண்டுபடுத்தல்',
    'help.reason.scam': 'காய்ப்பாளம் கருத்து',
    'help.reason.other': 'மற்றவை',
    'help.additional.details': 'மேலும் தகவல்கள்',
    'help.submit.report': 'அறிக்கையிடு',
    
    // Login Page - Additional
    'login.back.to.home': 'முகப்புக்கு திரும்பு',
    'login.welcome.back': 'AV தமிழ் மேட்ரிமோனியில் மீண்டும் வரவேற்கிறோம்',
    'login.logging.in': 'உள்நுழைக்கிறது...',
    'login.no.account.text': 'கணக்கு இல்லையா?',
    'login.register.here': 'இங்கு பதிவு செய்யவும்',
    
    // Register Page - Additional
    'register.back.to.home': 'முகப்புக்கு திரும்பு',
    'register.back.to.previous': 'முந்தைய படிக்கு திரும்பு',
    'register.step.of': 'படி {step} மூன்றில்',
    'register.profile.for': 'இந்த சுயவிவரம்',
    'register.select': 'தெரியுங்கள்',
    'register.self': 'உங்களாக',
    'register.son': 'பெருவர்',
    'register.daughter': 'பெருமை',
    'register.brother': 'தோன்றி',
    'register.sister': 'தோன்றி',
    'register.friend': 'வண்ணியர்',
    'register.relative': 'வாழ்க்கையான உறுப்பினர்',
    'register.community': 'சமூகம்',
    'register.height': 'உயரம்',
    'register.marital.status': 'திருமண நிலை',
    'register.never.married': 'ஏதுவும் திருமணம் செய்யவில்லை',
    'register.divorced': 'விவாகம் செய்யப்பட்டது',
    'register.widowed': 'விவாகம் செய்யப்பட்டது',
    'register.education': 'கல்வி',
    'register.occupation': 'தொழில்',
    'register.annual.income': 'ஆண்டு வருமானம்',
    'register.city': 'நகரம்',
    'register.state': 'நிலை',
    'register.caste': 'ஜாதி',
    'register.continue': 'தொடரு',
    'register.create.profile': 'சுயவிவரம் உருவாக்கு',
    'register.creating.profile': 'சுயவிவரம் உருவாக்குகிறது...',

    // HowItWorks Page
    'howitworks.badge': 'எப்படி வேலை செய்கிறது',
    'howitworks.title': 'உங்கள் முறையான வாழ்க்கைக்கு பாதுகாக்கும்',
    'howitworks.subtitle': 'உங்கள் சரியான ஜோடியைக் கண்டறிய நான்கு எளிமையான படிகள்',
    'howitworks.step.of': 'படி {num} நான்கில்',
    'howitworks.step1.title': 'உங்கள் சுயவிவரத்தை உருவாக்கு',
    'howitworks.step1.desc': 'உங்கள் விரிவான தகவல்கள், அங்கீட்டுகள் மற்றும் குடும்ப பிரிவுகளை பகிர்ந்து உங்கள் சுயவிவரத்தை உருவாக்குக. நம்முடன் உங்கள் தனியுரிமை பாதுகாக்கப்படுகின்றது மற்றும் உங்கள் பொருத்தங்களுடன் இணையும்.',
    'howitworks.step2.title': 'பொருத்தங்களைக் கண்டறியவும்',
    'howitworks.step2.desc': 'சரிபார்க்கப்பட்ட சுயவிவரங்களை உலாவவும் மற்றும் உங்கள் வித்தியாச வேகத்தில் உங்கள் ஆர்வத்தை அனுப்பவும்.',
    'howitworks.step3.title': 'இணையுங்கள் & தொடர்புகள் கூறுவும்',
    'howitworks.step3.desc': 'ஆர்வத்து முறையாக உள்ளது போது, உங்கள் குடும்பங்களுடன் அர்த்தமுள்ள தொடர்புகள் தொடங்குங்கள்.',
    'howitworks.step4.title': 'உங்கள் முறையான வாழ்க்கைக்கு பாதுகாக்கும் முறையில் தொடங்குங்கள்',
    'howitworks.step4.desc': 'உங்கள் குடும்பங்களுடன் இணையுங்கள், வெளிப்படுத்துங்கள் மற்றும் உங்கள் மூன்று மனத்தில் திருமணம் செய்ய முறையில் செல்வுங்கள்.',
    'howitworks.cta.title': 'உங்கள் முறையான வாழ்க்கைக்கு பாதுகாக்கும் முறையில் தொடங்குவாக தயாரா?',
    'howitworks.cta.desc': 'ஆயிரக்கணக்கான தமிழ் குடும்பங்கள் உங்கள் சரியான ஜோடியை AV மேட்ரிமோனி மூலம் கண்டுபிடித்தன. உங்களுக்கும் இதை செய்யவும்.',
    'howitworks.cta.button': 'இன்று உங்கள் சுயவிவரத்தை உருவாக்கு',

    // About Page
    'about.title': 'AV தமிழ் மேட்ரிமோனி பற்றி',
    'about.desc': '2015 இல் உருவாக்கப்பட்ட AV தமிழ் மேட்ரிமோனி தமிழ் குடும்பங்களை பூமியில் மற்றும் வெளிநாடுகளில் இணைக்கிறது, தங்கள் சரியான ஜோடியை தமிழ் மதிப்புகள் மற்றும் மறுமையான தொழில்நுடன் கண்டுபிடிக்கும்.',
    'about.mission.badge': 'எங்கள் முக்கியமை',
    'about.mission.title': 'குடும்பங்களை ஒன்றியமாக்கு',
    'about.values.title': 'AV தமிழ் மேட்ரிமோனியை என்னும் காரணம்',
    'about.values.subtitle': 'தமிழ் குடும்பங்களுக்கு முக்கியமான மதிப்புகளில் உருவாக்கப்பட்டது',
    'about.journey.title': 'எங்கள் முறையான வாழ்க்கை',
    'about.journey.subtitle': 'வாழ்க்கையான சரியான ஜோடியை கண்டுபிடிக்கும் வித்தியாச நாட்கள் மீது மூன்று வருடங்கள் முழுவதும்',
    'about.cta.title': 'எங்கள் சமூகத்தில் உள்ளது',
    'about.cta.desc': 'தமிழ் குடும்பங்கள் நம்முக்கு உங்கள் முக்கிய தேசியத்தை உறுதிப்படுத்துவதற்கு விருத்தியான மாற்றுகளை உறுதிப்படுத்துவதற்கு உள்ளது',
    'about.cta.button': 'இன்று உங்கள் சுயவிவரத்தை உருவாக்கு',

    // Stories Page
    'stories.title': 'வெற்றிக் கதைகள்',
    'stories.desc': 'AV தமிழ் மேட்ரிமோனி மூலம் கண்டுபிடித்த சரியான ஜோடியை கொண்ட பெயர்க்குறிப்புகள். அவர்கள் சரியான ஜோடியை கண்டுபிடித்தது எங்கள் மிக முக்கிய வெற்றி.',
    'stories.successful.marriages': 'வெற்றிகரமான திருமணங்கள்',
    'stories.countries.connected': 'இணைக்கப்பட்ட நாடுகள்',
    'stories.happy.families': 'மகிழ்ச்சியான குடும்பங்கள்',
    'stories.testimonials.title': 'குடும்பங்கள் என்னும் கருத்துகள்',
    'stories.testimonials.subtitle': 'நம்முக்கு உறுதிப்படுத்துவதற்கு குடும்பங்கள் கருத்துகள்',
    'stories.cta.title': 'உங்கள் கதை அடுத்தவர் இருக்கலாம்',
    'stories.cta.desc': 'ஆயிரக்கணக்கான மகிழ்ச்சியான ஜோடியை AV தமிழ் மேட்ரிமோனி மூலம் கண்டுபிடித்த குடும்பங்கள். உங்களுக்கும் இதை செய்யவும்.',
    'stories.cta.button': 'உங்கள் சுயவிவரத்தை உருவாக்கு',
    'stories.cta.learn': 'எப்படி வேலை செய்கிறது கற்று கொள்ளு',

    // Footer
    'footer.about.us': 'எங்களைப் பற்றி',
    'footer.about.av': 'AV மேட்ரிமோனி பற்றி',
    'footer.services': 'சேவைகள்',
    'footer.search.profiles': 'சுயவிவரங்களைத் தேடு',
    'footer.support': 'ஆதரவு',
    'footer.help.center': 'உதவி மையம்',
    'footer.contact.us': 'நம்முடன் தொடர்பு கொள்ளு',
    'footer.legal': 'சட்டமுறை',
    'footer.privacy': 'தனியுரிமை நிபந்தனை',
    'footer.terms': 'சேவை விதிகள்',
    'footer.copyright': '© 2026 AV தமிழ் மேட்ரிமோனி. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',

    // Admin Login
    'admin.portal.title': 'நிர்வாகி போர்ட்டல்',
    'admin.site.name': 'AV தமிழ் மேட்ரிமோனி',
    'admin.login.to.panel': 'நிர்வாகி பாலகையில் உள்நுழையவும்',
    'admin.security.notice': 'இது ஒரு பாதுகாப்பான நிர்வாகி இடம். அனைத்து செயல்பாடுகளும் பதிவு செய்யப்படுகின்றன.',

    // Toast Messages
    'toast.logout.success': 'வெற்றிகரமாக வெளியேறியது!',
    'toast.login.success': 'மீண்டும் வரவேற்கிறோம்!',
    'toast.register.success': 'பதிவு வெற்றிகரமாக! வரவேற்கிறோம்!',
    'toast.profile.updated': 'சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!',
    'toast.interest.sent': 'ஆர்வம் வெற்றிகரமாக அனுப்பப்பட்டது!',
    'toast.please.login': 'இந்தப் பக்கத்தை அணுக உள்நுழையவும்',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('language') : null;
    return (saved === 'ta' ? 'ta' : 'en') as Language;
  });

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[language][key as keyof typeof translations.en];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
