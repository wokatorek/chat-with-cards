exports.FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN;
exports.VERIFY_TOKEN = process.env.VERIFY_TOKEN;
exports.DB_HOST = process.env.DB_HOST;
exports.DB_PORT = process.env.DB_PORT;
exports.DB_PASSWORD = process.env.DB_PASSWORD;
exports.DB_USER = process.env.DB_USER;
exports.DB_NAME = process.env.DB_NAME;
exports.HOST_PORT = process.env.PORT;
exports.HOST_IP = process.env.IP;
exports.HELP_STRING = "Jeśli chcesz rozpocząć nową grę, napisz \"Nowa\". Opcjonalnie możesz wskazać liczbę talii, np. \"Nowa 2\" dla gry z dwiema taliami. Talie nie zawierają jokerów.\nJeśli chcesz dołączyć do gry napisz \"Dołącz id_gry\"";
exports.HELP_MORE = `Dostępne komendy. Wielkie litery nie mają znaczenia. Parametr w nawiasach okrągłych jest wymagany; parametr w nawiasach kwadratowych jest opcjonalny.
Aby dowiedzieć się więcej napisz "pomoc (komenda)"
- nowa [liczba talii, domyślnie 1]
- dołącz (id gry)
- dobierz [liczba kart, domyślnie 1]
- zagraj [karta do zagrania, jeśli na ręce została ostatnia karta nie trzeba jej podawać]
- ręka
- stos
- ostatnie karty
- cofnij
- gracze
- kto gra
- przetasuj`;
exports.HELP_SHUFFLE_STACK = "Zabiera ze stosu wszystkie karty oprócz leżącej na wierzchu, tasuje i wkłada na spód talii; nie można przetasować gdy na stosie jest tylko jedna karta.";
exports.SUITS = {CLUB: '\u2663', DIAMOND: '\u2666', HEART: '\u2665', SPADE: '\u2660'};
exports.CARD_REGEX = /(([AaKkJjQq][♠♣♥♦❤️\u2660\u2663\u2665\u2666]\s?)+|([2-9][♠♣♥♦❤️\u2660\u2663\u2665\u2666]\s?)+|(10[♠♣♥♦❤️\u2660\u2663\u2665\u2666]\s?)+|([♠♣♥♦❤️\u2660\u2663\u2665\u2666][AaKkJjQq]\s?)+|([♠♣♥♦❤️\u2660\u2663\u2665\u2666][2-9]\s?)+|([♠♣♥♦❤️\u2660\u2663\u2665\u2666]10\s?)+)+/i;
exports.GET_STARTED_PAYLOAD = "USER_GET_STARTED";
exports.PROFILE = {
    "get_started": {"payload": this.GET_STARTED_PAYLOAD},
    "greeting": [{"locale": "default", "text": "Cześć! Zagrajmy :)"}],
    // "persistent_menu": null
    // "account_linking_url": null
    "whitelisted_domains": ["https://www.master-7rqtwti-3iy3csgkkinlc.de-2.platformsh.site/"]
};
exports.PRIVACY_POLICY = "\t\t\t<h1>Welcome to our Privacy Policy</h1>\n" +
    "\t\t\t<h3>Your privacy is critically important to us.</h3>\n" +
    "\t\t\tMakaoBot is located at:<br/>\n" +
    "\t\t\t<address>\n" +
    "\t\t\t  MakaoBot<br/></address>\n" +
    "\n" +
    "\t\t\t<p>It is MakaoBot's policy to respect your privacy regarding any information we may collect while operating our website. This Privacy Policy applies to <a href=\"https://www.facebook.com/MakaoBot-100709204902307\">https://www.facebook.com/MakaoBot-100709204902307</a> (hereinafter, \"us\", \"we\", or \"https://www.facebook.com/MakaoBot-100709204902307\"). We respect your privacy and are committed to protecting personally identifiable information you may provide us through the Website. We have adopted this privacy policy (\"Privacy Policy\") to explain what information may be collected on our Website, how we use this information, and under what circumstances we may disclose the information to third parties. This Privacy Policy applies only to information we collect through the Website and does not apply to our collection of information from other sources.</p>\n" +
    "\t\t\t<p>This Privacy Policy, together with the Terms and conditions posted on our Website, set forth the general rules and policies governing your use of our Website. Depending on your activities when visiting our Website, you may be required to agree to additional terms and conditions.</p>\n" +
    "\n" +
    "\t\t\t\t\t\t<h2>Website Visitors</h2>\n" +
    "\t\t\t<p>Like most website operators, MakaoBot collects non-personally-identifying information of the sort that web browsers and servers typically make available, such as the browser type, language preference, referring site, and the date and time of each visitor request. MakaoBot's purpose in collecting non-personally identifying information is to better understand how MakaoBot's visitors use its website. From time to time, MakaoBot may release non-personally-identifying information in the aggregate, e.g., by publishing a report on trends in the usage of its website.</p>\n" +
    "\t\t\t<p>MakaoBot also collects potentially personally-identifying information like Internet Protocol (IP) addresses for logged in users and for users leaving comments on https://www.facebook.com/MakaoBot-100709204902307 blog posts. MakaoBot only discloses logged in user and commenter IP addresses under the same circumstances that it uses and discloses personally-identifying information as described below.</p>\n" +
    "\t\t\t\n" +
    "\t\t\t\t\t\t<h2>Gathering of Personally-Identifying Information</h2>\n" +
    "\t\t\t<p>Certain visitors to MakaoBot's websites choose to interact with MakaoBot in ways that require MakaoBot to gather personally-identifying information. The amount and type of information that MakaoBot gathers depends on the nature of the interaction. For example, we ask visitors who sign up for a blog at https://www.facebook.com/MakaoBot-100709204902307 to provide a username and email address.</p>\n" +
    "\t\t\t\n" +
    "\t\t\t\t\t\t<h2>Security</h2>\n" +
    "\t\t\t<p>The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.</p>\n" +
    "\t\t\t\n" +
    "\t\t\t\t\t\t<h2>Advertisements</h2>\n" +
    "\t\t\t<p>Ads appearing on our website may be delivered to users by advertising partners, who may set cookies. These cookies allow the ad server to recognize your computer each time they send you an online advertisement to compile information about you or others who use your computer. This information allows ad networks to, among other things, deliver targeted advertisements that they believe will be of most interest to you. This Privacy Policy covers the use of cookies by MakaoBot and does not cover the use of cookies by any advertisers.</p>\n" +
    "\t\t\t\n" +
    "\n" +
    "\t\t\t\t\t\t<h2>Links To External Sites</h2>\n" +
    "\t\t\t<p>Our Service may contain links to external sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy and terms and conditions of every site you visit.</p>\n" +
    "\t\t\t<p>We have no control over, and assume no responsibility for the content, privacy policies or practices of any third party sites, products or services.</p>\n" +
    "\t\t\t\n" +
    "\t\t\t\n" +
    "\t\t\t\n" +
    "\t\t\t\t\t\t<h2>Aggregated Statistics</h2>\n" +
    "\t\t\t<p>MakaoBot may collect statistics about the behavior of visitors to its website. MakaoBot may display this information publicly or provide it to others. However, MakaoBot does not disclose your personally-identifying information.</p>\n" +
    "\t\t\t\n" +
    "\t\t\t\n" +
    "\t\t\t\t\t\t<h2>Cookies</h2>\n" +
    "\t\t\t<p>To enrich and perfect your online experience, MakaoBot uses \"Cookies\", similar technologies and services provided by others to display personalized content, appropriate advertising and store your preferences on your computer.</p>\n" +
    "\t\t\t<p>A cookie is a string of information that a website stores on a visitor's computer, and that the visitor's browser provides to the website each time the visitor returns. MakaoBot uses cookies to help MakaoBot identify and track visitors, their usage of https://www.facebook.com/MakaoBot-100709204902307, and their website access preferences. MakaoBot visitors who do not wish to have cookies placed on their computers should set their browsers to refuse cookies before using MakaoBot's websites, with the drawback that certain features of MakaoBot's websites may not function properly without the aid of cookies.</p>\n" +
    "\t\t\t<p>By continuing to navigate our website without changing your cookie settings, you hereby acknowledge and agree to MakaoBot's use of cookies.</p>\n" +
    "\t\t\t\n" +
    "\t\t\t\n" +
    "\t\t\t\n" +
    "\t\t\t\t\t\t<h2>Privacy Policy Changes</h2>\n" +
    "\t\t\t<p>Although most changes are likely to be minor, MakaoBot may change its Privacy Policy from time to time, and in MakaoBot's sole discretion. MakaoBot encourages visitors to frequently check this page for any changes to its Privacy Policy. Your continued use of this site after any change in this Privacy Policy will constitute your acceptance of such change.</p>\n" +
    "\t\t\t\n" +
    "\t\t\t\n" +
    "\t\t\t\t\t\t  \n" +
    "\t\t\t  <h2></h2>\t\t\t  \n" +
    "\t\t\t  \t<p></p>\t\t\t\n" +
    "\t\t\t\n" +
    "\t\t\t<h2>Credit & Contact Information</h2>\n" +
    "\t\t\t\t\t\t\t<p>This privacy policy was created at <a style=\"color:inherit;text-decoration:none;\" href=\"https://termsandconditionstemplate.com/privacy-policy-generator/\" title=\"Privacy policy template generator\" target=\"_blank\">termsandconditionstemplate.com</a>. If you have any questions about this Privacy Policy, please contact us via <a href=\"mailto:facebook.invigilation@gmail.com\">email</a>.</p>\n" +
    "\t\t\t\t\t";
