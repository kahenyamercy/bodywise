/* BodyWise — reference list.
   Every URL below was opened and its title checked on 28 October 2026.
   Lessons cite these by id. Add new sources here, never inline in lessons. */
(function (BW) {
  'use strict';
  var OS = 'https://openstax.org/books/anatomy-and-physiology-2e/pages/';
  var checked = '2026-10-28';
  function os(id, slug, title) {
    return { id: id, org: 'OpenStax', title: 'Anatomy and Physiology 2e, ' + title, url: OS + slug, checked: checked, licence: 'CC BY 4.0' };
  }
  BW.references = [
    os('os-preface', 'preface', 'Preface (book home)'),
    os('os-homeostasis', '1-5-homeostasis', '1.5 Homeostasis'),
    os('os-membrane', '3-1-the-cell-membrane', '3.1 The Cell Membrane'),
    os('os-nervous-tissue', '12-2-nervous-tissue', '12.2 Nervous Tissue'),
    os('os-action-potential', '12-4-the-action-potential', '12.4 The Action Potential'),
    os('os-autonomic', '15-1-divisions-of-the-autonomic-nervous-system', '15.1 Divisions of the Autonomic Nervous System'),
    os('os-pituitary', '17-3-the-pituitary-gland-and-hypothalamus', '17.3 The Pituitary Gland and Hypothalamus'),
    os('os-pancreas', '17-9-the-endocrine-pancreas', '17.9 The Endocrine Pancreas'),
    os('os-blood', '18-1-an-overview-of-blood', '18.1 An Overview of Blood'),
    os('os-heart-anatomy', '19-1-heart-anatomy', '19.1 Heart Anatomy'),
    os('os-cardiac-cycle', '19-3-cardiac-cycle', '19.3 Cardiac Cycle'),
    os('os-vascular-regulation', '20-4-homeostatic-regulation-of-the-vascular-system', '20.4 Homeostatic Regulation of the Vascular System'),
    os('os-innate', '21-2-barrier-defenses-and-the-innate-immune-response', '21.2 Barrier Defenses and the Innate Immune Response'),
    os('os-adaptive', '21-3-the-adaptive-immune-response-t-lymphocytes-and-their-functional-types', '21.3 The Adaptive Immune Response: T Lymphocytes'),
    os('os-gas-exchange', '22-4-gas-exchange', '22.4 Gas Exchange'),
    os('os-gas-transport', '22-5-transport-of-gases', '22.5 Transport of Gases'),
    os('os-digestive', '23-1-overview-of-the-digestive-system', '23.1 Overview of the Digestive System'),
    os('os-absorption', '23-7-chemical-digestion-and-absorption-a-closer-look', '23.7 Chemical Digestion and Absorption'),
    os('os-heat', '24-6-energy-and-heat-balance', '24.6 Energy and Heat Balance'),
    os('os-urine', '25-5-physiology-of-urine-formation', '25.5 Physiology of Urine Formation'),
    os('os-kidney-endocrine', '25-8-endocrine-regulation-of-kidney-function', '25.8 Endocrine Regulation of Kidney Function'),
    os('os-fluids', '26-1-body-fluids-and-fluid-compartments', '26.1 Body Fluids and Fluid Compartments'),
    os('os-ovarian', '27-2-anatomy-and-physiology-of-the-ovarian-reproductive-system', '27.2 Anatomy and Physiology of the Ovarian Reproductive System'),
    os('os-pregnancy', '28-4-changes-during-pregnancy-labor-and-birth', '28.4 Changes During Pregnancy, Labor, and Birth'),
    os('os-muscle', '10-3-muscle-fiber-contraction-and-relaxation', '10.3 Muscle Fiber Contraction and Relaxation'),
    { id: 'niddk-kidneys', org: 'NIDDK (US National Institutes of Health)', title: 'Your Kidneys & How They Work', url: 'https://www.niddk.nih.gov/health-information/kidney-disease/kidneys-how-they-work', checked: checked },
    { id: 'nhlbi-lungs', org: 'NHLBI (US National Institutes of Health)', title: 'How the Lungs Work', url: 'https://www.nhlbi.nih.gov/health/lungs', checked: checked },
    { id: 'nhlbi-heart', org: 'NHLBI (US National Institutes of Health)', title: 'How the Heart Works', url: 'https://www.nhlbi.nih.gov/health/heart', checked: checked },
    { id: 'mp-temperature', org: 'MedlinePlus (US National Library of Medicine)', title: 'Body temperature norms', url: 'https://medlineplus.gov/ency/article/001982.htm', checked: checked },
    { id: 'mp-videos', org: 'MedlinePlus (US National Library of Medicine)', title: 'Health and anatomy videos', url: 'https://medlineplus.gov/anatomyvideos.html', checked: checked },
    { id: 'statpearls-raas', org: 'NCBI Bookshelf, StatPearls', title: 'Physiology, Renin Angiotensin System', url: 'https://www.ncbi.nlm.nih.gov/sites/books/NBK470410/', checked: checked },
    { id: 'statpearls-temp', org: 'NCBI Bookshelf, StatPearls', title: 'Physiology, Temperature Regulation', url: 'https://www.ncbi.nlm.nih.gov/sites/books/NBK507838/', checked: checked },
    { id: 'who-maternal', org: 'World Health Organization', title: 'Maternal mortality (fact sheet)', url: 'https://www.who.int/news-room/fact-sheets/detail/maternal-mortality', checked: checked }
  ];
  BW.refById = {};
  BW.references.forEach(function (r) { BW.refById[r.id] = r; });
})(window.BW = window.BW || {});
