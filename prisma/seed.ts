import "dotenv/config";
import { hash } from "bcryptjs";
import { randomUUID } from "node:crypto";
import {
  Gender,
  ProfileStatus,
  PrismaClient,
  UserRole,
} from "@prisma/client";
import { INTEREST_OPTIONS } from "../src/lib/constants/interests";
import { parseHeightToCentimeters } from "../src/lib/profile-utils";
import { createSqliteAdapter } from "../src/server/prisma/adapter";

const prisma = new PrismaClient({
  adapter: createSqliteAdapter(),
});
const seededMemberPassword = process.env.SEED_MEMBER_PASSWORD ?? randomUUID();

const sampleMembers = [
  {
    fullName: "Priya Sundaram",
    email: "priya.sundaram@local.avt",
    phone: "9000000001",
    gender: Gender.FEMALE,
    dateOfBirth: "1999-06-18",
    heightLabel: `5'4" (163 cm)`,
    city: "Chennai",
    state: "Tamil Nadu",
    education: "B.Tech",
    occupation: "Software Engineer",
    annualIncome: "₹8-10 Lakhs",
    caste: "Iyer",
    community: "Tamil Brahmin",
    about:
      "Warm, grounded, and family-oriented. I enjoy meaningful conversations, travel within India, and a home life built on mutual respect.",
    interests: ["Reading", "Music", "Cooking", "Travelling", "Yoga"],
  },
  {
    fullName: "Lakshmi Krishnan",
    email: "lakshmi.krishnan@local.avt",
    phone: "9000000002",
    gender: Gender.FEMALE,
    dateOfBirth: "1997-11-02",
    heightLabel: `5'2" (157 cm)`,
    city: "Coimbatore",
    state: "Tamil Nadu",
    education: "M.Ed",
    occupation: "Teacher",
    annualIncome: "₹5-7 Lakhs",
    caste: "Iyengar",
    community: "Tamil Iyengar",
    about:
      "Calm, thoughtful, and close to family. I value sincerity, emotional maturity, and a stable long-term partnership.",
    interests: ["Painting", "Reading", "Yoga", "Nature Walks", "Gardening"],
  },
  {
    fullName: "Arun Narayanan",
    email: "arun.narayanan@local.avt",
    phone: "9000000003",
    gender: Gender.MALE,
    dateOfBirth: "1995-03-22",
    heightLabel: `5'10" (178 cm)`,
    city: "Madurai",
    state: "Tamil Nadu",
    education: "MBA",
    occupation: "Product Manager",
    annualIncome: "₹18-22 Lakhs",
    caste: "Pillai",
    community: "Tamil Pillai",
    about:
      "Professionally driven, values-led, and equally invested in family life. Looking for a partner with warmth, ambition, and kindness.",
    interests: ["Technology", "Business", "Travelling", "Coffee", "Community Service"],
  },
  {
    fullName: "Karthik Raman",
    email: "karthik.raman@local.avt",
    phone: "9000000004",
    gender: Gender.MALE,
    dateOfBirth: "1996-08-14",
    heightLabel: `5'8" (173 cm)`,
    city: "Salem",
    state: "Tamil Nadu",
    education: "MBBS",
    occupation: "Doctor",
    annualIncome: "₹15-18 Lakhs",
    caste: "Mudaliar",
    community: "Tamil Mudaliar",
    about:
      "Structured, compassionate, and sincere. I appreciate a balanced life, meaningful family traditions, and a partner who communicates openly.",
    interests: ["Reading", "Wellness", "Meditation", "Classical Music", "Cycling"],
  },
];

async function syncInterestCatalog() {
  for (const interest of INTEREST_OPTIONS) {
    await prisma.interestTag.upsert({
      where: {
        slug: interest.slug,
      },
      update: {
        label: interest.label,
        category: interest.category,
      },
      create: {
        slug: interest.slug,
        label: interest.label,
        category: interest.category,
      },
    });
  }
}

async function attachInterests(profileId: string, labels: string[]) {
  await prisma.profileInterest.deleteMany({
    where: {
      profileId,
    },
  });

  const tags = await prisma.interestTag.findMany({
    where: {
      label: {
        in: labels,
      },
    },
  });

  await prisma.profileInterest.createMany({
    data: tags.map((tag) => ({
      profileId,
      interestId: tag.id,
    })),
  });
}

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME ?? "AVT Local Admin";

  if (!adminEmail || !adminPassword) {
    return;
  }

  await prisma.user.upsert({
    where: {
      email: adminEmail,
    },
    update: {
      fullName: adminName,
      passwordHash: await hash(adminPassword, 12),
      role: UserRole.ADMIN,
    },
    create: {
      email: adminEmail,
      fullName: adminName,
      passwordHash: await hash(adminPassword, 12),
      role: UserRole.ADMIN,
    },
  });
}

async function seedMembers() {
  for (const member of sampleMembers) {
    const user = await prisma.user.upsert({
      where: {
        email: member.email,
      },
      update: {
        fullName: member.fullName,
        phone: member.phone,
        profile: {
          upsert: {
            create: {
              gender: member.gender,
              dateOfBirth: new Date(member.dateOfBirth),
              heightCm: parseHeightToCentimeters(member.heightLabel),
              heightLabel: member.heightLabel,
              maritalStatus: "Never Married",
              religion: "Hindu",
              caste: member.caste,
              community: member.community,
              country: "India",
              state: member.state,
              city: member.city,
              education: member.education,
              occupation: member.occupation,
              annualIncome: member.annualIncome,
              about: member.about,
              partnerExpectations:
                "Looking for a respectful, family-centered partner with shared values and long-term commitment.",
              status: ProfileStatus.APPROVED,
              isProfileComplete: true,
            },
            update: {
              gender: member.gender,
              dateOfBirth: new Date(member.dateOfBirth),
              heightCm: parseHeightToCentimeters(member.heightLabel),
              heightLabel: member.heightLabel,
              maritalStatus: "Never Married",
              religion: "Hindu",
              caste: member.caste,
              community: member.community,
              country: "India",
              state: member.state,
              city: member.city,
              education: member.education,
              occupation: member.occupation,
              annualIncome: member.annualIncome,
              about: member.about,
              partnerExpectations:
                "Looking for a respectful, family-centered partner with shared values and long-term commitment.",
              status: ProfileStatus.APPROVED,
              isProfileComplete: true,
            },
          },
        },
      },
      create: {
        email: member.email,
        fullName: member.fullName,
        phone: member.phone,
        passwordHash: await hash(seededMemberPassword, 12),
        role: UserRole.MEMBER,
        profile: {
          create: {
            gender: member.gender,
            dateOfBirth: new Date(member.dateOfBirth),
            heightCm: parseHeightToCentimeters(member.heightLabel),
            heightLabel: member.heightLabel,
            maritalStatus: "Never Married",
            religion: "Hindu",
            caste: member.caste,
            community: member.community,
            country: "India",
            state: member.state,
            city: member.city,
            education: member.education,
            occupation: member.occupation,
            annualIncome: member.annualIncome,
            about: member.about,
            partnerExpectations:
              "Looking for a respectful, family-centered partner with shared values and long-term commitment.",
            status: ProfileStatus.APPROVED,
            isProfileComplete: true,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    if (user.profile) {
      await attachInterests(user.profile.id, member.interests);
    }
  }
}

async function main() {
  await syncInterestCatalog();
  await seedAdmin();
  await seedMembers();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
