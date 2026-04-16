import { PrismaClient, UserRole, CertificateType, AdmissionStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // ── Admin User ──────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('Admin@123456', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@mirukhali.edu.bd' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@mirukhali.edu.bd',
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // ── Teachers ────────────────────────────────────────────────────────────────
  const teachersData = [
    {
      name: 'মোঃ আব্দুর রহমান',
      designation: 'অধ্যক্ষ (ভারপ্রাপ্ত)',
      subject: 'বাংলা',
      qualification: 'এম.এ, বি.এড',
      joinDate: new Date('1998-01-15'),
      phone: '01711-000001',
      email: 'principal@mirukhali.edu.bd',
      order: 1,
    },
    {
      name: 'মোঃ জাহাঙ্গীর আলম',
      designation: 'সহকারী প্রধান শিক্ষক',
      subject: 'গণিত',
      qualification: 'এম.এস.সি, বি.এড',
      joinDate: new Date('2000-03-01'),
      phone: '01711-000002',
      email: 'jahangir@mirukhali.edu.bd',
      order: 2,
    },
    {
      name: 'মোছাঃ রহিমা বেগম',
      designation: 'সহকারী শিক্ষক',
      subject: 'ইংরেজি',
      qualification: 'এম.এ, বি.এড',
      joinDate: new Date('2002-06-01'),
      phone: '01711-000003',
      order: 3,
    },
    {
      name: 'মোঃ কামাল হোসেন',
      designation: 'সহকারী শিক্ষক',
      subject: 'বিজ্ঞান',
      qualification: 'এম.এস.সি',
      joinDate: new Date('2003-09-01'),
      phone: '01711-000004',
      order: 4,
    },
    {
      name: 'মোছাঃ নাসরিন আক্তার',
      designation: 'সহকারী শিক্ষক',
      subject: 'সামাজিক বিজ্ঞান',
      qualification: 'এম.এস.এস, বি.এড',
      joinDate: new Date('2004-01-10'),
      phone: '01711-000005',
      order: 5,
    },
    {
      name: 'মোঃ শফিকুল ইসলাম',
      designation: 'সহকারী শিক্ষক',
      subject: 'ইসলাম ধর্ম ও নৈতিক শিক্ষা',
      qualification: 'এম.এ (ইসলামিক স্টাডিজ)',
      joinDate: new Date('2005-07-01'),
      phone: '01711-000006',
      order: 6,
    },
    {
      name: 'মোছাঃ ফাতেমা বেগম',
      designation: 'সহকারী শিক্ষক',
      subject: 'বাংলা',
      qualification: 'এম.এ, বি.এড',
      joinDate: new Date('2006-03-15'),
      phone: '01711-000007',
      order: 7,
    },
    {
      name: 'মোঃ রফিকুল ইসলাম',
      designation: 'সহকারী শিক্ষক',
      subject: 'ইংরেজি',
      qualification: 'এম.এ',
      joinDate: new Date('2007-06-01'),
      phone: '01711-000008',
      order: 8,
    },
    {
      name: 'মোঃ সিরাজুল হক',
      designation: 'সহকারী শিক্ষক',
      subject: 'পদার্থ বিজ্ঞান',
      qualification: 'এম.এস.সি',
      joinDate: new Date('2008-01-01'),
      phone: '01711-000009',
      order: 9,
    },
    {
      name: 'মোছাঃ শিরিন আক্তার',
      designation: 'সহকারী শিক্ষক',
      subject: 'রসায়ন',
      qualification: 'এম.এস.সি',
      joinDate: new Date('2009-04-01'),
      phone: '01711-000010',
      order: 10,
    },
    {
      name: 'মোঃ আনোয়ার হোসেন',
      designation: 'সহকারী শিক্ষক',
      subject: 'জীববিজ্ঞান',
      qualification: 'এম.এস.সি',
      joinDate: new Date('2010-07-01'),
      phone: '01711-000011',
      order: 11,
    },
    {
      name: 'মোঃ মিজানুর রহমান',
      designation: 'সহকারী শিক্ষক',
      subject: 'কৃষিশিক্ষা',
      qualification: 'বি.এস.সি (কৃষি)',
      joinDate: new Date('2011-01-01'),
      phone: '01711-000012',
      order: 12,
    },
    {
      name: 'মোছাঃ মোসাম্মৎ খুরশিদা বেগম',
      designation: 'সহকারী শিক্ষক',
      subject: 'গার্হস্থ্য বিজ্ঞান',
      qualification: 'এম.এস.এস',
      joinDate: new Date('2012-03-01'),
      phone: '01711-000013',
      order: 13,
    },
  ]

  for (const t of teachersData) {
    await prisma.teacher.upsert({
      where: { phone: t.phone },
      update: {},
      create: t,
    })
  }
  console.log(`✅ ${teachersData.length} teachers seeded`)

  // ── Students ────────────────────────────────────────────────────────────────
  const studentsData = [
    { admissionNo: 'MSC-2020-001', name: 'মোঃ রাকিবুল হাসান', class: 'X', section: 'A', roll: '01', fatherName: 'মোঃ আব্দুল করিম', motherName: 'মোছাঃ রাহেলা বেগম', phone: '01800-000001', address: 'মিরুখালী, মঠবাড়িয়া, পিরোজপুর', admissionDate: new Date('2020-01-10') },
    { admissionNo: 'MSC-2020-002', name: 'মোছাঃ সুমাইয়া আক্তার', class: 'X', section: 'A', roll: '02', fatherName: 'মোঃ হারুন অর রশিদ', motherName: 'মোছাঃ রওশন আরা', phone: '01800-000002', address: 'মিরুখালী, মঠবাড়িয়া, পিরোজপুর', admissionDate: new Date('2020-01-10') },
    { admissionNo: 'MSC-2020-003', name: 'মোঃ ইমরান হোসেন', class: 'X', section: 'B', roll: '01', fatherName: 'মোঃ জলিল মোল্লা', motherName: 'মোছাঃ মর্জিনা বেগম', phone: '01800-000003', address: 'মিরুখালী, মঠবাড়িয়া, পিরোজপুর', admissionDate: new Date('2020-01-10') },
    { admissionNo: 'MSC-2020-004', name: 'মোছাঃ তানিয়া সুলতানা', class: 'IX', section: 'A', roll: '01', fatherName: 'মোঃ আমিনুল ইসলাম', motherName: 'মোছাঃ হাসিনা বেগম', phone: '01800-000004', address: 'মিরুখালী, মঠবাড়িয়া, পিরোজপুর', admissionDate: new Date('2021-01-10') },
    { admissionNo: 'MSC-2020-005', name: 'মোঃ সাকিব আল হাসান', class: 'IX', section: 'A', roll: '02', fatherName: 'মোঃ আলাউদ্দিন', motherName: 'মোছাঃ রোজিনা বেগম', phone: '01800-000005', address: 'মিরুখালী, মঠবাড়িয়া, পিরোজপুর', admissionDate: new Date('2021-01-10') },
    { admissionNo: 'MSC-2021-001', name: 'মোছাঃ নুসরাত জাহান', class: 'VIII', section: 'A', roll: '01', fatherName: 'মোঃ মাসুদ রানা', motherName: 'মোছাঃ লাইলা বেগম', phone: '01800-000006', address: 'মিরুখালী, মঠবাড়িয়া, পিরোজপুর', admissionDate: new Date('2021-01-12') },
    { admissionNo: 'MSC-2021-002', name: 'মোঃ তানভীর আহমেদ', class: 'VIII', section: 'A', roll: '02', fatherName: 'মোঃ মকবুল হোসেন', motherName: 'মোছাঃ ফরিদা বেগম', phone: '01800-000007', address: 'মিরুখালী, মঠবাড়িয়া, পিরোজপুর', admissionDate: new Date('2021-01-12') },
    { admissionNo: 'MSC-2021-003', name: 'মোছাঃ রিমা আক্তার', class: 'VII', section: 'A', roll: '01', fatherName: 'মোঃ ফারুক হোসেন', motherName: 'মোছাঃ শিউলি বেগম', phone: '01800-000008', address: 'মিরুখালী, মঠবাড়িয়া, পিরোজপুর', admissionDate: new Date('2022-01-10') },
    { admissionNo: 'MSC-2021-004', name: 'মোঃ নাফিস ইসলাম', class: 'VII', section: 'A', roll: '02', fatherName: 'মোঃ মাহবুবুর রহমান', motherName: 'মোছাঃ সালমা বেগম', phone: '01800-000009', address: 'মিরুখালী, মঠবাড়িয়া, পিরোজপুর', admissionDate: new Date('2022-01-10') },
    { admissionNo: 'MSC-2022-001', name: 'মোছাঃ মিম আক্তার', class: 'VI', section: 'A', roll: '01', fatherName: 'মোঃ সাইফুল ইসলাম', motherName: 'মোছাঃ মাহমুদা বেগম', phone: '01800-000010', address: 'মিরুখালী, মঠবাড়িয়া, পিরোজপুর', admissionDate: new Date('2022-01-15') },
    { admissionNo: 'MSC-2022-002', name: 'মোঃ সিয়াম হোসেন', class: 'VI', section: 'A', roll: '02', fatherName: 'মোঃ শাহজাহান মোল্লা', motherName: 'মোছাঃ নাজমা বেগম', phone: '01800-000011', address: 'মিরুখালী, মঠবাড়িয়া, পিরোজপুর', admissionDate: new Date('2022-01-15') },
    { admissionNo: 'MSC-2019-001', name: 'মোঃ আরিফুল ইসলাম', class: 'XI', section: 'বিজ্ঞান', roll: '01', fatherName: 'মোঃ নূর হোসেন', motherName: 'মোছাঃ রহিমা বেগম', phone: '01800-000012', address: 'মিরুখালী, মঠবাড়িয়া, পিরোজপুর', admissionDate: new Date('2023-07-01') },
    { admissionNo: 'MSC-2019-002', name: 'মোছাঃ সাবিনা ইয়াসমিন', class: 'XI', section: 'বিজ্ঞান', roll: '02', fatherName: 'মোঃ মঞ্জুরুল ইসলাম', motherName: 'মোছাঃ কবিতা বেগম', phone: '01800-000013', address: 'মিরুখালী, মঠবাড়িয়া, পিরোজপুর', admissionDate: new Date('2023-07-01') },
    { admissionNo: 'MSC-2019-003', name: 'মোঃ জিহাদ হাসান', class: 'XI', section: 'মানবিক', roll: '01', fatherName: 'মোঃ জাফর আলী', motherName: 'মোছাঃ দিলরুবা বেগম', phone: '01800-000014', address: 'মিরুখালী, মঠবাড়িয়া, পিরোজপুর', admissionDate: new Date('2023-07-01') },
    { admissionNo: 'MSC-2018-001', name: 'মোঃ রাজিব হোসেন', class: 'XII', section: 'বিজ্ঞান', roll: '01', fatherName: 'মোঃ সিদ্দিকুর রহমান', motherName: 'মোছাঃ পারভীন বেগম', phone: '01800-000015', address: 'মিরুখালী, মঠবাড়িয়া, পিরোজপুর', admissionDate: new Date('2022-07-01') },
    { admissionNo: 'MSC-2018-002', name: 'মোছাঃ শারমিন সুলতানা', class: 'XII', section: 'মানবিক', roll: '01', fatherName: 'মোঃ আশরাফুল ইসলাম', motherName: 'মোছাঃ বিলকিস বেগম', phone: '01800-000016', address: 'মিরুখালী, মঠবাড়িয়া, পিরোজপুর', admissionDate: new Date('2022-07-01') },
    { admissionNo: 'MSC-2022-003', name: 'মোঃ মেহেদী হাসান', class: 'VI', section: 'A', roll: '03', fatherName: 'মোঃ বদরুল আলম', motherName: 'মোছাঃ জেসমিন আক্তার', phone: '01800-000017', address: 'মিরুখালী, মঠবাড়িয়া, পিরোজপুর', admissionDate: new Date('2022-01-15') },
    { admissionNo: 'MSC-2021-005', name: 'মোছাঃ লামিয়া আক্তার', class: 'VIII', section: 'B', roll: '01', fatherName: 'মোঃ মোস্তফা কামাল', motherName: 'মোছাঃ সুমি বেগম', phone: '01800-000018', address: 'মিরুখালী, মঠবাড়িয়া, পিরোজপুর', admissionDate: new Date('2021-01-12') },
    { admissionNo: 'MSC-2020-006', name: 'মোঃ সোহেল রানা', class: 'IX', section: 'B', roll: '01', fatherName: 'মোঃ রমজান আলী', motherName: 'মোছাঃ হেলেনা বেগম', phone: '01800-000019', address: 'মিরুখালী, মঠবাড়িয়া, পিরোজপুর', admissionDate: new Date('2021-01-10') },
    { admissionNo: 'MSC-2020-007', name: 'মোছাঃ ঝুমা আক্তার', class: 'X', section: 'B', roll: '02', fatherName: 'মোঃ আনিসুর রহমান', motherName: 'মোছাঃ আনজুমান আরা', phone: '01800-000020', address: 'মিরুখালী, মঠবাড়িয়া, পিরোজপুর', admissionDate: new Date('2020-01-10') },
    { admissionNo: 'MSC-2019-004', name: 'মোঃ রনি ইসলাম', class: 'XI', section: 'ব্যবসায় শিক্ষা', roll: '01', fatherName: 'মোঃ আব্দুল হামিদ', motherName: 'মোছাঃ রেখা বেগম', phone: '01800-000021', address: 'মিরুখালী, মঠবাড়িয়া, পিরোজপুর', admissionDate: new Date('2023-07-01') },
    { admissionNo: 'MSC-2018-003', name: 'মোছাঃ মাহফুজা খানম', class: 'XII', section: 'ব্যবসায় শিক্ষা', roll: '01', fatherName: 'মোঃ আব্দুস সালাম', motherName: 'মোছাঃ নূরজাহান বেগম', phone: '01800-000022', address: 'মিরুখালী, মঠবাড়িয়া, পিরোজপুর', admissionDate: new Date('2022-07-01') },
  ]

  for (const s of studentsData) {
    await prisma.student.upsert({
      where: { admissionNo: s.admissionNo },
      update: {},
      create: s,
    })
  }
  console.log(`✅ ${studentsData.length} students seeded`)

  // ── Notices ─────────────────────────────────────────────────────────────────
  const noticesData = [
    {
      title: 'এসএসসি পরীক্ষার রুটিন ২০২৪',
      content: 'বাংলাদেশ মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড কর্তৃক প্রকাশিত এসএসসি পরীক্ষা ২০২৪ এর রুটিন অনুযায়ী পরীক্ষা শুরু হবে ১৫ ফেব্রুয়ারি ২০২৪ তারিখ থেকে। সকল পরীক্ষার্থীকে নির্ধারিত সময়ের ৩০ মিনিট পূর্বে পরীক্ষা কেন্দ্রে উপস্থিত থাকতে হবে। প্রবেশপত্র ও বোর্ড প্রদত্ত পরিচয়পত্র সাথে আনা বাধ্যতামূলক।',
      category: 'Examination',
      isPublished: true,
      publishDate: new Date('2024-01-10'),
      createdById: admin.id,
    },
    {
      title: '২০২৪-২৫ শিক্ষাবর্ষে ভর্তি বিজ্ঞপ্তি',
      content: 'মিরুখালী স্কুল এন্ড কলেজে ২০২৪-২৫ শিক্ষাবর্ষে ষষ্ঠ থেকে দ্বাদশ শ্রেণিতে ভর্তির আবেদন গ্রহণ শুরু হয়েছে। আবেদনের শেষ তারিখ: ৩১ জানুয়ারি ২০২৪। ভর্তি পরীক্ষা অনুষ্ঠিত হবে ০৫ ফেব্রুয়ারি ২০২৪ তারিখ। ভর্তির জন্য প্রয়োজনীয় কাগজপত্র: জন্মনিবন্ধন সনদ, পূর্ববর্তী শ্রেণির মার্কশিট ও ছাড়পত্র।',
      category: 'Admission',
      isPublished: true,
      publishDate: new Date('2024-01-05'),
      createdById: admin.id,
    },
    {
      title: 'বার্ষিক ক্রীড়া প্রতিযোগিতা ২০২৪',
      content: 'আগামী ২০ জানুয়ারি ২০২৪ তারিখ বিদ্যালয় মাঠে বার্ষিক ক্রীড়া প্রতিযোগিতা অনুষ্ঠিত হবে। সকল শিক্ষার্থীদের সাদা পোশাক পরে সকাল ৯টার মধ্যে মাঠে উপস্থিত থাকতে অনুরোধ করা হচ্ছে। বিভিন্ন ইভেন্টে অংশ নিতে ইচ্ছুক শিক্ষার্থীরা ১৫ জানুয়ারির মধ্যে শ্রেণি শিক্ষকের কাছে নাম জমা দেবে।',
      category: 'Sports',
      isPublished: true,
      publishDate: new Date('2024-01-12'),
      createdById: admin.id,
    },
    {
      title: 'অর্ধবার্ষিক পরীক্ষার ফলাফল প্রকাশ',
      content: '২০২৩ সালের অর্ধবার্ষিক পরীক্ষার ফলাফল প্রকাশিত হয়েছে। শিক্ষার্থীরা বিদ্যালয় অফিস থেকে মার্কশিট সংগ্রহ করতে পারবে। ফলাফল সম্পর্কিত যেকোনো অভিযোগ ১০ দিনের মধ্যে অফিসে জমা দিতে হবে।',
      category: 'Result',
      isPublished: true,
      publishDate: new Date('2023-12-15'),
      createdById: admin.id,
    },
    {
      title: 'সরকারি ছুটির তালিকা ২০২৪',
      content: '২০২৪ সালের সরকারি ছুটির তালিকা অনুযায়ী বিদ্যালয় বন্ধ থাকবে। ২১ ফেব্রুয়ারি আন্তর্জাতিক মাতৃভাষা দিবস, ১৭ মার্চ বঙ্গবন্ধুর জন্মদিন, ২৬ মার্চ স্বাধীনতা দিবস, ১৪ এপ্রিল বাংলা নববর্ষ, ঈদুল ফিতর ও ঈদুল আযহায় নির্ধারিত ছুটি থাকবে। বিস্তারিত তালিকা নোটিশ বোর্ডে দেখুন।',
      category: 'Holiday',
      isPublished: true,
      publishDate: new Date('2024-01-01'),
      createdById: admin.id,
    },
    {
      title: 'শিক্ষার্থীদের বৃত্তি পরীক্ষার বিজ্ঞপ্তি',
      content: 'প্রাথমিক বৃত্তি পরীক্ষায় উত্তীর্ণ শিক্ষার্থীরা বিদ্যালয় অফিসে যোগাযোগ করুন। বৃত্তির আবেদনপত্র পূরণের শেষ তারিখ ২০ জানুয়ারি ২০২৪। প্রয়োজনীয় কাগজপত্র: বৃত্তি পরীক্ষার সনদ, জন্মনিবন্ধন সনদ, অভিভাবকের আয়ের সনদ।',
      category: 'Scholarship',
      isPublished: true,
      publishDate: new Date('2024-01-08'),
      createdById: admin.id,
    },
    {
      title: 'বিজ্ঞান মেলা ২০২৪',
      content: 'আগামী ২৮ জানুয়ারি ২০২৪ তারিখ বিদ্যালয় প্রাঙ্গণে বার্ষিক বিজ্ঞান মেলা অনুষ্ঠিত হবে। নবম ও দশম শ্রেণির শিক্ষার্থীরা বিজ্ঞান প্রকল্প জমা দিতে পারবে। প্রকল্পের বিষয়বস্তু নির্বাচন করে ২০ জানুয়ারির মধ্যে শ্রেণি শিক্ষককে জানাতে হবে।',
      category: 'Event',
      isPublished: true,
      publishDate: new Date('2024-01-14'),
      createdById: admin.id,
    },
    {
      title: 'এইচএসসি পরীক্ষার ফরম পূরণ বিজ্ঞপ্তি',
      content: 'এইচএসসি ২০২৪ পরীক্ষার ফরম পূরণ শুরু হয়েছে। দ্বাদশ শ্রেণির সকল শিক্ষার্থীকে ০৫ ফেব্রুয়ারির মধ্যে বিদ্যালয় অফিসে ফরম পূরণের ফি ও প্রয়োজনীয় কাগজপত্র জমা দিতে হবে। বিলম্ব ফি সহ আবেদনের শেষ তারিখ ১৫ ফেব্রুয়ারি।',
      category: 'Examination',
      isPublished: true,
      publishDate: new Date('2024-01-20'),
      createdById: admin.id,
    },
    {
      title: 'অভিভাবক সমাবেশ ২০২৪',
      content: 'আগামী ২৫ জানুয়ারি ২০২৪ তারিখ বেলা ১১টায় বিদ্যালয় প্রাঙ্গণে অভিভাবক সমাবেশ অনুষ্ঠিত হবে। সকল শিক্ষার্থীর অভিভাবককে উপস্থিত থাকার জন্য বিশেষভাবে অনুরোধ করা হচ্ছে। অনুপস্থিত অভিভাবকদের শিক্ষার্থীদের বিদ্যালয় কর্তৃপক্ষ বিশেষ নজরে রাখবে।',
      category: 'General',
      isPublished: true,
      publishDate: new Date('2024-01-18'),
      createdById: admin.id,
    },
    {
      title: 'বার্ষিক সাংস্কৃতিক অনুষ্ঠান',
      content: 'বিদ্যালয়ের বার্ষিক সাংস্কৃতিক অনুষ্ঠান ০১ ফেব্রুয়ারি ২০২৪ বিকাল ৩টায় অনুষ্ঠিত হবে। বিভিন্ন সাংস্কৃতিক পরিবেশনায় অংশ নিতে ইচ্ছুক শিক্ষার্থীরা ২২ জানুয়ারির মধ্যে নাম নিবন্ধন করুন। অনুষ্ঠানে সকল অভিভাবক ও শুভানুধ্যায়ীদের আমন্ত্রণ জানানো হচ্ছে।',
      category: 'Event',
      isPublished: false,
      publishDate: new Date('2024-01-25'),
      createdById: admin.id,
    },
  ]

  for (const n of noticesData) {
    await prisma.notice.create({ data: n })
  }
  console.log(`✅ ${noticesData.length} notices seeded`)

  // ── Results ─────────────────────────────────────────────────────────────────
  const student1 = await prisma.student.findUnique({ where: { admissionNo: 'MSC-2020-001' } })
  const student2 = await prisma.student.findUnique({ where: { admissionNo: 'MSC-2020-002' } })
  const student3 = await prisma.student.findUnique({ where: { admissionNo: 'MSC-2020-003' } })

  if (student1 && student2 && student3) {
    await prisma.result.createMany({
      data: [
        { studentId: student1.id, examName: 'Annual Examination', class: 'X', section: 'A', subject: 'বাংলা', marksObtained: 85, totalMarks: 100, grade: 'A+', year: '2023' },
        { studentId: student1.id, examName: 'Annual Examination', class: 'X', section: 'A', subject: 'ইংরেজি', marksObtained: 78, totalMarks: 100, grade: 'A', year: '2023' },
        { studentId: student2.id, examName: 'Annual Examination', class: 'X', section: 'A', subject: 'গণিত', marksObtained: 92, totalMarks: 100, grade: 'A+', year: '2023' },
        { studentId: student2.id, examName: 'Annual Examination', class: 'X', section: 'A', subject: 'বিজ্ঞান', marksObtained: 88, totalMarks: 100, grade: 'A+', year: '2023' },
        { studentId: student3.id, examName: 'Half Yearly', class: 'X', section: 'B', subject: 'বাংলা', marksObtained: 72, totalMarks: 100, grade: 'A', year: '2023' },
      ],
    })
    console.log('✅ Results seeded')
  }

  // ── Committee ────────────────────────────────────────────────────────────────
  await prisma.committee.createMany({
    data: [
      {
        name: 'মোঃ আব্দুল কাদের মোল্লা',
        designation: 'সভাপতি, বিদ্যালয় পরিচালনা কমিটি',
        role: 'Chairman',
        phone: '01711-100001',
        term: '২০২২-২০২৫',
        order: 1,
        isActive: true,
      },
      {
        name: 'মোঃ নুরুল ইসলাম হাওলাদার',
        designation: 'সাধারণ সম্পাদক, বিদ্যালয় পরিচালনা কমিটি',
        role: 'Secretary',
        phone: '01711-100002',
        term: '২০২২-২০২৫',
        order: 2,
        isActive: true,
      },
      {
        name: 'মোছাঃ হামিদা বেগম',
        designation: 'কোষাধ্যক্ষ, বিদ্যালয় পরিচালনা কমিটি',
        role: 'Treasurer',
        phone: '01711-100003',
        term: '২০২২-২০২৫',
        order: 3,
        isActive: true,
      },
    ],
  })
  console.log('✅ Committee members seeded')

  // ── Gallery ──────────────────────────────────────────────────────────────────
  await prisma.gallery.createMany({
    data: [
      { title: 'বার্ষিক ক্রীড়া প্রতিযোগিতা ২০২৩', caption: 'বিদ্যালয় মাঠে বার্ষিক ক্রীড়া প্রতিযোগিতার দৃশ্য', imageUrl: '/uploads/gallery/sports-day-2023.jpg', category: 'Sports' },
      { title: 'বিজ্ঞান মেলা ২০২৩', caption: 'শিক্ষার্থীদের বৈজ্ঞানিক প্রকল্প প্রদর্শনী', imageUrl: '/uploads/gallery/science-fair-2023.jpg', category: 'Science Fair' },
      { title: 'বার্ষিক সাংস্কৃতিক অনুষ্ঠান ২০২৩', caption: 'শিক্ষার্থীদের মনোজ্ঞ সাংস্কৃতিক পরিবেশনা', imageUrl: '/uploads/gallery/cultural-2023.jpg', category: 'Cultural' },
      { title: 'স্বাধীনতা দিবস পালন ২০২৩', caption: 'মহান স্বাধীনতা দিবস উপলক্ষে বিদ্যালয়ের অনুষ্ঠান', imageUrl: '/uploads/gallery/independence-day-2023.jpg', category: 'Annual Day' },
      { title: 'এসএসসি বিদায় সংবর্ধনা ২০২৩', caption: 'এসএসসি পরীক্ষার্থীদের বিদায় সংবর্ধনা অনুষ্ঠান', imageUrl: '/uploads/gallery/farewell-2023.jpg', category: 'Graduation' },
    ],
  })
  console.log('✅ Gallery entries seeded')

  // ── Facilities ───────────────────────────────────────────────────────────────
  await prisma.facility.createMany({
    data: [
      { name: 'বিশাল খেলার মাঠ', description: 'বিদ্যালয়ে একটি বিশাল খেলার মাঠ রয়েছে যেখানে শিক্ষার্থীরা ক্রিকেট, ফুটবল, ভলিবলসহ বিভিন্ন খেলাধুলায় অংশগ্রহণ করতে পারে। মাঠে ফুটবল গোলপোস্ট ও ক্রিকেট পিচ রয়েছে।', icon: 'Trophy', order: 1, isActive: true },
      { name: 'মসজিদ', description: 'বিদ্যালয় প্রাঙ্গণে একটি সুন্দর মসজিদ রয়েছে যেখানে শিক্ষার্থী, শিক্ষক ও কর্মকর্তারা দৈনিক পাঁচ ওয়াক্ত নামাজ আদায় করতে পারেন। মসজিদটি শিক্ষার্থীদের নৈতিক ও ধর্মীয় শিক্ষায় গুরুত্বপূর্ণ ভূমিকা রাখে।', icon: 'Building', order: 2, isActive: true },
      { name: 'ছাত্রাবাস', description: 'দূরবর্তী শিক্ষার্থীদের জন্য বিদ্যালয়ে একটি ছাত্রাবাস রয়েছে। ছাত্রাবাসে থাকা ও খাওয়ার সুবিধাসহ পড়ার পরিবেশ নিশ্চিত করা হয়। অভিজ্ঞ হাউস টিউটরের তত্ত্বাবধানে শিক্ষার্থীরা নিরাপদে থাকতে পারে।', icon: 'Home', order: 3, isActive: true },
      { name: 'পাঠাগার', description: 'বিদ্যালয়ে একটি সমৃদ্ধ পাঠাগার রয়েছে। পাঠাগারে বাংলা ও ইংরেজি ভাষায় পাঠ্যবইসহ সাহিত্য, বিজ্ঞান, ইতিহাস ও বিভিন্ন বিষয়ের দুই হাজারেরও বেশি বই রয়েছে। শিক্ষার্থীরা বিনামূল্যে বই পড়তে পারে।', icon: 'BookOpen', order: 4, isActive: true },
      { name: 'বিজ্ঞান ল্যাবরেটরি', description: 'বিজ্ঞান শিক্ষাকে আরও কার্যকর করতে বিদ্যালয়ে একটি সুসজ্জিত বিজ্ঞান ল্যাবরেটরি রয়েছে। এখানে পদার্থবিজ্ঞান, রসায়ন ও জীববিজ্ঞানের ব্যবহারিক পরীক্ষা-নিরীক্ষার সুযোগ রয়েছে। আধুনিক যন্ত্রপাতি ও রাসায়নিক দ্রব্যাদি সংরক্ষিত আছে।', icon: 'Flask', order: 5, isActive: true },
      { name: 'কম্পিউটার ল্যাব', description: 'তথ্যপ্রযুক্তি শিক্ষায় শিক্ষার্থীদের দক্ষ করতে বিদ্যালয়ে একটি আধুনিক কম্পিউটার ল্যাবরেটরি রয়েছে। ল্যাবে ২০টি কম্পিউটার ও ব্রডব্যান্ড ইন্টারনেট সংযোগ রয়েছে। শিক্ষার্থীরা এখানে কম্পিউটার বিজ্ঞান ও তথ্যপ্রযুক্তি বিষয়ে হাতে-কলমে শিক্ষা গ্রহণ করে।', icon: 'Monitor', order: 6, isActive: true },
    ],
  })
  console.log('✅ Facilities seeded')

  // ── Settings ─────────────────────────────────────────────────────────────────
  const settingsData = [
    { key: 'school_name', value: 'Mirukhali School & College' },
    { key: 'school_name_bn', value: 'মিরুখালী স্কুল এন্ড কলেজ' },
    { key: 'school_eiin', value: '102726' },
    { key: 'school_established', value: '1 January 1937' },
    { key: 'school_address', value: 'Mirukhali, Mathbaria, Pirojpur-8514, Bangladesh' },
    { key: 'school_address_bn', value: 'মিরুখালী, মঠবাড়িয়া, পিরোজপুর-৮৫১৪, বাংলাদেশ' },
    { key: 'school_phone', value: '+880-4628-75XXX' },
    { key: 'school_email', value: 'info@mirukhali.edu.bd' },
    { key: 'school_type', value: 'Private MPO Enlisted, Co-Education' },
    { key: 'total_teachers', value: '13' },
    { key: 'total_staff', value: '4' },
    { key: 'total_students', value: '679' },
    { key: 'principal_name', value: 'মোঃ আব্দুর রহমান' },
    { key: 'principal_phone', value: '01711-000001' },
    { key: 'principal_email', value: 'principal@mirukhali.edu.bd' },
    { key: 'facebook_url', value: '' },
    { key: 'admission_open', value: 'true' },
  ]

  for (const s of settingsData) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    })
  }
  console.log(`✅ ${settingsData.length} settings seeded`)

  console.log('🎉 Seed completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
