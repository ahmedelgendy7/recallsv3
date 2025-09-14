"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  RotateCcw,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Play,
  Repeat,
  Check,
  ArrowRight,
  Trophy,
  Star,
  Search,
} from "lucide-react"
import PromotionWidget from "@/app/components/PromotionWidget"
import Image from "next/image"
import Navigation from "./components/Navigation"
import LoadingComponent from "./loading"

interface Word {
  word: string
  context?: string
  spokenWord?: string
}

interface WordList {
  name: string
  words: Word[]
}

interface QuizResult {
  word: string
  userAnswer: string
  correct: boolean
}

const LANGUAGE_CODE = "en-GB"
const SPEECH_RATE = 0.8
const PROMPTS = {
  good: "Good!",
  oops: "Oops!",
  spell: "Spell:",
  greatJob: "Great job!",
}

const TelegramHeader = () => (
  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3">
    <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-4">
        <a
          href="https://t.me/elgendy011"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-full transition-colors text-sm font-medium"
        >
          📱 Contact me here
          <br />
          <span className="text-xs">Dr Ahmed Elgendy</span>
        </a>
        <span className="text-sm opacity-90">|</span>
        <span className="text-sm font-medium">Join our telegram channel</span>
      </div>
      <a
        href="https://t.me/OETultimacy"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-100 px-6 py-2 rounded-full transition-colors font-medium"
      >
        📢 OET Ultimacy Channel
      </a>
    </div>
  </div>
)

// Embedded OET vocabulary words
const EMBEDDED_WORDS = [
  "breech",
  "infertile",
  "probiotic",
  "sailor",
  "perfumes",
  "gentle exercise",
  "unsociable",
  "office",
  "flight attendant",
  "relief",
  "speech impairment",
  "agoraphobia",
  "bloating",
  "night sweats",
  "breastfeed",
  "irritable",
  "gallstones",
  "sticky",
  "greasy",
  "pneumonia",
  "white crust",
  "affection",
  "panic",
  "yoga class",
  "darker",
  "hip",
  "sepsis",
  "Down syndrome",
  "numbness",
  "constipation",
  "blurred vision",
  "fish oil",
  "massage therapist",
  "graphic designer",
  "thumb",
  "stiff",
  "vegetarian",
  "coconut oil",
  "headaches",
  "eczema",
  "biopsy",
  "lawyer",
  "malaria",
  "deodorant",
  "arthritis",
  "lower back",
  "contiguous",
  "contagious",
  "chins",
  "stress",
  "sick and dizzy",
  "neck",
  "constricted veins",
  "congested vein",
  "beeswax",
  "stinging",
  "styes",
  "white",
  "cold compress",
  "complication",
  "eye drops",
  "ointment",
  "lying down",
  "cholesterol",
  "blisters",
  "left knee",
  "anxiety",
  "asthma",
  "vomiting",
  "diarrhoea",
  "Achilles tendon",
  "red meat",
  "prostate cancer",
  "kidney stones",
  "yoghurt",
  "oat",
  "melanoma",
  "wrist",
  "clingy",
  "restless",
  "teething",
  "rugby",
  "ultrasound",
  "concentration",
  "insomnia",
  "cry",
  "energy",
  "exhaustion",
  "cystitis",
  "eyelids",
  "garlic pills",
  "shooting sensation",
  "chemotherapy",
  "frozen egg",
  "hair loss",
  "hot pads",
  "panic attacks",
  "bruises",
  "bulimia",
  "fertility",
  "oral contraceptives",
  "heat packs",
  "left buttock",
  "gardener",
  "malaria tablets",
  "soap",
  "urethral dilation",
  "adhesion",
  "suprapubic catheter",
  "Botox injection",
  "sphincter",
  "anaesthetic medication",
  "urine retention",
  "bladder",
  "iron deficiency anaemia",
  "spasm",
  "intermittent catheter",
  "pins and needles",
  "tea tree oil",
  "bitter taste",
  "software developer",
  "stroke",
  "watery",
  "tumour markers",
  "abdominal area",
  "presentation",
  "wedding",
  "numbness",
  "sleep apnoea",
  "lymph nodes",
  "irritable bowel syndrome",
  "multiple sclerosis",
  "muscle dystrophy",
  "chubby",
  "menopause",
  "sprain ankle",
  "hand cream",
  "ointment",
  "swollen tongue",
  "environmental engineering",
  "skin rashes",
  "stomach cramps",
  "dyspepsia",
  "tennis ball",
  "strangulation",
  "Down syndrome",
  "yoga",
  "hiking",
  "blurred vision",
  "PPI",
  "flat position",
  "iron deficiency anaemia",
  "wheezing",
  "graphic designer",
  "shingles",
  "dust",
  "psoriasis",
  "urinary tract infection",
  "presentation",
  "paralysis",
  "personal trainer",
  "crowded places",
  "sticky",
  "greasy",
  "bloating",
  "bouts of vomiting",
  "life-threatening",
  "finances",
  "pneumonia",
  "surveyor",
  "fertility",
  "probiotic",
  "cystitis",
  "acoustic neuroma",
  "radiation",
  "basketball",
  "market research",
  "badly taste",
  "bad odour",
  "throbbing",
  "sharp",
  "punctured lung",
  "stiffness",
  "nosebleeds",
  "appendectomy",
  "van driver",
  "sinus inflammation",
  "scarlet fever",
  "university lecturer",
  "lower back",
  "fertility treatment",
  "thirsty",
  "drowsy",
  "migraines",
  "popping sound",
  "oesophageal cancer",
  "gluten-free",
  "obese",
  "shower gels",
  "thighs",
  "fine",
  "back",
  "colouring",
  "red meat",
  "chickenpox",
  "nasal spray",
  "immune system",
  "aching",
  "programmer",
  "calamine lotion",
  "itchy",
  "eyebrows",
  "herbal oil",
  "deodorant",
  "burning",
  "iron deficiency",
  "depression",
  "weight gain",
  "heparin injection",
  "Hearing loss",
  "Impaction",
  "engineer",
  "building sites",
  "blotches",
  "scalp",
  "swelling",
  "eczema",
  "itchy",
  "burning",
  "constipation",
  "heel",
  "osteoarthritis",
  "atrial fibrillation",
  "translator",
  "bruising",
  "sway",
  "disorientation",
  "emotional outbursts",
  "choking",
  "autism",
  "holter monitor",
  "muscle biopsy",
  "swimming",
  "blood thinners",
  "unsaturated fats",
  "dizzy spells",
  "palpitations",
  "breathless",
  "bereavement",
  "dancing instructor",
  "died",
  "ear infection",
  "ablation",
  "flu",
  "Alzheimer’s disease",
  "femur",
  "rods",
  "swimming",
  "jump",
  "vitamin D",
  "sleep apnoea",
  "shoulders",
  "fatigue",
  "anxious",
  "journalist",
  "numbness",
  "goalkeeper",
  "tea",
  "irritable bowel syndrome",
  "chef",
  "insomnia",
  "tomatoes",
  "lying down",
  "antihistamines",
  "central nervous system",
  "compartment syndrome",
  "carpenter",
  "tingling",
  "stiffness",
  "collarbone",
  "punctured lung",
  "acupuncture",
  "left calf",
  "varicose veins",
  "wrist brace",
  "metal rod",
  "bent",
  "strawberry tongue",
  "irritable",
  "washing hair",
  "sepsis",
  "pneumonia",
  "diabetes",
  "knife and fork",
  "scarlet fever",
  "bloodshot",
  "fingertips",
  "cracked lips",
  "Japan",
  "epilepsy",
  "concentrate",
  "booster injection",
  "febrile convulsion",
  "pressure sores",
  "physiotherapy",
  "events manager",
  "sticky",
  "change dressing",
  "chubby",
  "judge distance",
  "multiple sclerosis",
  "administrator",
  "preventer",
  "steroid",
  "menstruation",
  "car accident",
  "fuzzy",
  "injection",
  "lunch time",
  "hearing loss",
  "swallow",
  "vocabulary",
  "vascular",
  "eating",
  "some sort of food",
  "urinalysis",
  "deafness",
  "magazine editor",
  "lethargic",
  "visual perception",
  "heartbeats",
  "tightness",
  "financial problems",
  "cut two fingers",
  "nausea",
  "lung expansion",
  "tantrum",
  "groin area",
  "asking",
  "nausea",
  "indigestion",
  "full blood count",
  "cloudy",
  "cold compress",
  "lethargic",
  "confidence",
  "popping",
  "clicking",
  "heel",
  "osteoarthritis",
  "deep vein thrombosis",
  "atrial fibrillation",
  "swollen",
  "yoga",
  "aerobic exercises",
  "physiotherapy session",
  "calf ",
  "calves",
  "crutches",
  "translator",
  "mouth ulcers",
  "infection",
  "compartment syndrome",
  "painkillers",
  "antisocial",
  "chills",
  "fingertips",
  "B12 deficiency",
  "angina",
  "rib cage",
  "swallowing",
  "drained",
  "confusion",
  "shivering",
  "stinging",
  "bloating",
  "tonsillectomy",
  "potassium level",
  "overactive thyroid",
  "gymnastics",
  "anaemia",
  "indoor exercises",
  "tongue-tie",
  "crusty mucus",
  "dyspepsia",
  "crowded places",
  "white crusts",
  "antihistamine",
  "breathless",
  "infertile",
  "night sweats",
  "sticky",
  "strangulation",
  "lying flat",
  "surveyor",
  "clockwise",
  "left calf",
  "punctured lung",
  "social gatherings",
  "tinnitus",
  "vomited",
  "injection",
  "hearing loss",
  "stomach",
  "groin",
  "gastric bypass",
  "angina",
  "confidence",
  "in concentration",
  "baggage",
  "tailor",
  "tendon",
  "savoury",
  "nasal spray",
  "thighs",
  "programmer",
  "itchy",
  "red meat",
  "shower gels",
  "darker",
  "herbal oil",
  "obese",
  "bladder",
  "hiking",
  "calamine lotion",
  "tonsillitis",
  "dragging",
  "corticosteroids",
  "spider",
  "thirsty",
  "greasy",
  "whooping cough",
  "scrotum",
  "whiplash injury",
  "pituitary",
  "pleurisy",
  "disorientation",
  "construction worker",
  "pulsing",
  "bruise",
  "red spots",
  "dry mouth",
  "distracted",
  "ginseng supplements",
  "senna tablets",
  "neighbour",
  "incontinence",
  "burping",
  "sales manager",
  "pre-eclampsia",
  "four months",
  "meat",
  "oranges",
  "lemonades",
  "crowded places",
  "spasm",
  "prostatic cancer",
  "septicemia",
  "cirrhosis",
  "smoking",
  "bereavement",
  "vegetarian",
  "intermittent",
  "vocabulary",
  "blurred",
  "financial difficulties",
  "graphic designer",
  "driving",
  "down syndrome",
  "motivation",
  "sinusitis",
  "temper",
  "mononucleosis",
  "swollen ankle",
  "asthma",
  "engineer",
  "mumps",
  "sleepiness",
  "magnesium",
  "garlic",
  "widow",
  "building inspector",
  "pneumonia",
  "amnesia",
  "incontinence",
  "testosterone",
  "botanist",
  "lupus",
  "left tibia",
  "steroids",
  "infertile",
  "stinging",
  "headache",
  "knife",
  "knives",
  "shoulders",
  "handwriting",
  "low fat",
  "low-fat diet",
  "gallstones",
  "gallbladder",
  "burning",
  "dragging",
  "self-catheterisation",
  "Zika virus",
  "clumps",
  "overactive thyroid",
  "irritated",
  "IV antibiotics",
  "specialised message",
  "compression socks",
  "swelling up",
  "fever",
  "heavy lifting",
  "liposuction",
  "croup",
  "carpenter",
  "fell",
  "steady",
  "glue ear",
  "agitated",
  "ammonia",
  "vomiting",
  "central nervous system",
  "swelling",
  "malarone tablets",
  "administrator",
  "broken ribs",
  "heartbeat",
  "anger",
  "swollen tongue",
  "pneumonia",
  "eczema",
  "multiple sclerosis",
  "booster injection",
  "sticky",
  "cracked lips",
  "strawberry tongue",
  "febrile convulsion",
  "epilepsy",
  "irritable",
  "fingertips",
  "bloodshot",
  "groin area",
  "scarlet fever",
  "judge distance",
  "itchy",
  "eczema",
  "programmer",
  "red meat",
  "calamine lotion",
  "perfumes",
  "pink eye",
  "angina",
  "shivering",
  "gastric bypass",
  "bump his head",
  "bumps ",
  "memory",
  "tonic-clonic",
  "partial seizure",
  "tingling",
  "paracetamol",
  "beta blocker",
  "concussion",
  "glandular fever",
  "lupus",
  "pulmonary embolism",
  "joints pain",
  "VNS therapy",
  "many strokes",
  "freeze",
  "dribbling",
  "convulsions",
  "blood clots",
  "financial advisor",
  "frontal lobe",
  "seizures",
  "Meniere’s disease",
  "preventer",
  "fuzzy",
  "loss of hearing",
  "social gathering",
  "propranolol",
  "tetanus",
  "tinnitus",
  "mouth ulcer",
  "canker sores",
  "16mg",
  "vision",
  "lunchtime",
  "squat position",
  "acute inflammation",
  "anti-clockwise",
  "crackling",
  "patella",
  "fuzzy",
  "vomited",
  "exercise straps",
  "hearing loss",
  "hamstring",
  "stretching",
  "urgency",
  "crackling",
  "knee",
  "diabetes",
  "chef",
  "intense",
  "irritable bowel syndrome",
  "femur",
  "pins and needles",
  "antihistamine",
  "swelling",
  "cold sores",
  "depression",
  "heart murmur",
  "cycling",
  "iron deficiency anaemia",
  "nightmares",
  "lower back",
  "heat pads",
  "engineering",
  "lying flat position",
  "vomiting",
  "PPI (proton pump inhibitors)",
  "dyspepsia",
  "strangulation",
  "kidney infection",
  "wheezing",
  "sweating",
  "pleurisy",
  "jabbing",
  "counselling",
  "tennis ball",
  "sleep apnoea",
  "spasm",
  "breathlessness",
  "ibuprofen",
  "pneumonia",
  "bloating",
  "shivering",
  "perfume",
  "white crust",
  "greasy",
  "sticky",
  "night sweats",
  "crowded places",
  "surveyor",
  "angina",
  "infertile",
  "confidence",
  "antisocial",
  "pink eyes",
  "gastric bypass surgery",
  "swallowing",
  "shivering",
  "lethargic",
  "cold compression",
  "above normal",
  "dread",
  "B12 deficiency",
  "chef",
  "firefighter",
  "heartburn",
  "bloating",
  "anxiety",
  "tired",
  "weightlifter",
  "allergy test",
  "dementia",
  "training",
  "swimming",
  "soccer",
  "alcohol",
  "fibromyalgia",
  "antispasmodic",
  "disc prolapse",
  "cracked",
  "pancreatitis",
  "antifungal",
  "mechanic",
  "vomiting",
  "sinus infection",
  "ladder",
  "rotator cuff",
  "co-codamol",
  "ice packs",
  "bump on the head",
  "bumps",
  "complex partial",
  "trance",
  "dribble",
  "freeze",
  "vns therapy",
  "convulsions",
  "weight",
  "ribs",
  "pulmonary embolism",
  "heparin injections",
  "skin rashes",
  "lupus",
  "joint pain",
  "stroke",
  "vertigo",
  "concussions",
  "anti-inflammatory",
  "corticosteroid injection",
  "ethanol",
  "carbohydrates",
  "golf",
  "constipation",
  "depression",
  "neck",
  "thyroid",
  "steroid injection",
  "3 miscarriages",
  "C-reactive protein",
  "ultrasound",
  "arthritis",
  "uterine cancer",
  "uterine balloon",
  "right shoulder",
  "financial advisor",
  "juvenile rheumatic arthritis",
  "lupus",
  "light bleeding",
  "menopause",
  "eczema",
  "meningitis",
  "environmental engineering",
  "scalp",
  "saline drip",
  "hand cream",
  "ointment",
  "kidney stone",
  "insomnia",
  "freeze",
  "ribs",
  "pulmonary embolism",
  "heparin injections",
  "skin rashes",
  "lupus",
  "joint pain",
  "stroke",
  "vertigo",
  "bloating",
  "anxiety",
  "tired",
  "swimming",
  "soccer",
  "alcohol",
  "stiff",
  "bloated",
  "debilitating",
  "journalist",
  "colonoscopy",
  "multivitamin",
  "vitamin B12",
  "swimming",
  "gastric flu",
  "fitful",
  "fatigue",
  "cloudy",
  "palpitations",
  "barium enema",
  "stomach ulcer",
  "trembling",
  "law",
  "isolated",
  "clouded",
  "joint pain",
  "metallic",
  "caffeine",
  "cystoscopy",
  "high blood pressure",
  "itching",
  "IBS",
  "transplant",
  "dark red",
  "protein",
  "big toe",
  "joints",
  "wrists",
  "shingles",
  "anti-inflammatories",
  "cut my food",
  "concentration",
  "physical activity",
  "graded exercise therapy",
  "counsellor",
  "faint",
  "palpitations",
  "sweating",
  "sensitivity to light",
  "underactive thyroid",
  "contagious",
  "antiseptic shampoo",
  "irritated skin",
  "dilantin",
  "rhinocort nasal spray",
  "mucofen",
  "flurbiprofen",
  "klonopin",
  "rivaroxaban",
  "mitomycin",
  "flomax",
  "advair diskus",
  "celebrex",
  "neurontin",
  "cyclophosphamide",
  "allopurinol",
  "morphine",
  "zolpidem",
  "nitroglycerin",
  "clopidogrel",
  "keflex",
  "atenolol",
  "sodium bicarbonate",
  "neoprene",
  "cardizem",
  "metoprolol",
  "hydralazine",
  "labetalol",
  "levothyroxine",
  "zyrtec",
  "proscar",
  "synthroid",
  "motrin",
  "avelox",
  "codeine",
  "chlordiazepoxide",
  "clindinium",
  "simvastatin",
  "flagyl",
  "daptomycin",
  "primaxin",
  "methadone",
  "levaquin",
  "floppy",
  "tongue",
  "earache",
  "spasms",
  "gums",
  "exhaustion",
  "breast cancer",
  "femur",
  "hay fever",
  "project manager",
  "patches",
  "antacid",
  "craving",
  "irritable",
  "pus",
  "hard",
  "lighter",
  "new mouse",
  "golf ball",
  "collarbone",
  "restless legs syndrome",
  "carpal tunnel syndrome",
  "scar",
  "aspiration",
  "burning",
  "yoga",
  "fish oil",
  "nausea",
  "zinc",
  "humidity",
  "stiffness",
  "pregnancy",
  "clicking",
  "gardener",
  "fracture",
  "breathless",
  "cheese",
  "drill",
  "mood swing",
  "constant pain",
  "gardener",
  "fracture",
  "breathless",
  "cricking",
  "burning",
  "new mouse",
  "jewellery maker",
  "scar",
  "aspiration",
  "burning sensation",
  "prostate cancer",
  "echocardiogram",
  "fluid",
  "salads",
  "dialysis",
  "life-threatening",
  "finances",
  "cycling",
  "itchy leg",
  "dark red urine",
  "cystoscopy",
  "nosebleeds",
  "verapamil",
  "vegetarian diet",
  "dietary",
  "tooth extraction",
  "cauterisation",
  "cardiologist",
  "dry cough",
  "respiratory infection",
  "depression",
  "biopsy",
  "laparoscopy",
  "swallowing",
  "graphic designer",
  "blood test",
  "memory lapse",
  "fidget",
  "strengthening exercises",
  "cellulitis",
  "stumbling",
  "aneurysm",
  "sides of buttocks",
  "seizure",
  "soccer",
  "dairy",
  "diary",
  "physiotherapy",
  "balance",
  "bearable",
  "beer",
  "bear",
  "bank manager",
  "liver",
  "cancer",
  "tired",
  "eyes",
  "migraines",
  "acupuncture",
  "blotches",
  "alcohol",
  "firefighters",
  "migraine",
  "gluten",
  "ACE inhibitors",
  "stroke",
  "cracked",
  "bloating",
  "brown marks",
  "rheumatology",
  "big toe arthritis",
  "baclofen",
  "magazine editor",
  "high-impact sports",
  "sugar",
  "swelling",
  "constipation",
  "darker",
  "frightening",
  "vibrating",
  "carpenter",
  "restricted diet",
  "gout",
  "acupuncture",
  "dermatology consultation",
  "corticosteroids",
  "allergy",
  "pruritus",
  "hives",
  "orange",
  "lemonade",
  "sales manger",
  "sepsis",
  "multiple organ failure",
  "peritonitis",
  "right thumb",
  "steroid",
  "stomach pain",
  "hernia",
  "sepsis",
  "ventilation",
  "colonoscopy",
  "stoma",
  "cholesterol",
  "meningitis",
  "right thumb",
  "menopause",
  "growing pain",
  "arthritis",
  "flat mattress",
  "coma",
  "hernia",
  "sepsis",
  "ventilator",
  "abdominal pain",
  "tonsillitis",
  "tonsil",
  "tonsillectomy",
  "withdrawn",
  "knee",
  "limping",
  "limb",
  "shoulder",
  "ankles",
  "stinging",
  "healthy",
  "gallstones",
  "tingling",
  "muscles",
  "back",
  "incontinence",
  "accountant",
  "sister",
  "drive",
  "aerobics",
  "sugar",
  "healthy",
  "low-fat diet",
  "cold water",
  "swimming",
  "flight attendant",
  "blood transfusion",
  "perfumed",
  "hydrated",
  "emotional",
  "beer",
  "skin is dry and flaky.",
  "diet free of gluten",
  "blisters",
  "eczema",
  "asthma",
  "bicycle",
  "basketball",
  "oily fish",
  "flight attendant",
  "depression",
  "throat infection",
  "perfumed",
  "ketogenic",
  "cataract",
  "blood transfusion",
  "left thumb",
  "flaky",
  "drinking tea",
  "water",
  "drooping eyelid",
  "peanut",
  "active thyroid",
  "security guard",
  "bloating",
  "tingling",
  "nephrologist",
  "neurologist",
  "high-fibre diet",
  "accountant",
  "cycling",
  "kidney cancer",
  "sciatica",
  "physiotherapy",
  "hiking",
  "eczema",
  "kidney graft",
  "security guard",
  "canal",
  "calves",
  "thighs",
  "two toes",
  "abdomen",
  "warehouse",
  "pus",
  "stinging",
  "piercing",
  "headache",
  "botox",
  "wheezing",
  "fatigue",
  "heartburn",
  "angina",
  "chest",
  "anaemia",
  "shoulder",
  "badminton",
  "blotchy",
  "leathery skin",
  "gout",
  "hips",
  "stiff",
  "weakness",
  "pins and needles",
  "energy",
  "ice packs",
  "basketball",
  "left thigh",
  "longstanding",
  "swollen",
  "dark red",
  "eczema",
  "bandage",
  "stiff",
  "weakness",
  "swollen",
  "panic attack",
  "hypertension",
  "eczema",
  "herbalist",
  "guitar",
  "hydrocortisone",
  "dark red",
  "smell",
  "ice packs",
  "weightlifting",
  "alcohol",
  "chest infection",
  "obesity",
  "left ventricle",
  "stage 3",
  "call centre",
  "convenience diet",
  "scuba diving",
  "vascular dementia",
  "leukaemia",
  "swimming",
  "fractured rib",
  "ears",
  "sinuses",
  "management",
  "scoliosis",
  "translator",
  "fertility",
  "breastfeeding",
  "blurred vision",
  "stroke",
  "angina",
  "knees",
  "absence seizures",
  "rheumatoid fever",
  "echo",
  "stuttered",
  "acoustic neuroma",
  "omega-3",
  "hacking",
  "whispering",
  "dog trainer",
  "asthma",
  "lupus groin",
  "hammer",
  "incontinence",
  "web designer",
  "pleurisy",
  "chest tightness",
  "chest infection",
  "translator",
  "fertility",
  "stutter",
  "dog trainer",
  "jogging",
  "hacking",
  "rheumatic fever",
  "left leg",
  "angina",
  "obesity",
  "blurring of vision",
  "fast food",
  "vascular dementia",
  "stroke",
  "swimming",
  "voice",
  "breastfeeding",
  "fractured rib",
  "knee",
  "ears",
  "scoliosis",
  "astigmatism",
  "white",
  "glue",
  "oral antibiotics",
  "mushrooms",
  "sour taste",
  "sore throat",
  "choking",
  "osteoarthritis",
  "warm compresses",
  "dental assistant",
  "rubella",
  "salmonella",
  "styes",
  "melatonin",
  "melanoma",
  "tea tree oil",
  "topical antibiotic",
  "blinking",
  "dandruff",
  "regurgitation",
  "computer",
  "Meniere’s disease",
  "lunch",
  "social gathering",
  "tinnitus",
  "stretching",
  "acute inflammation",
  "inflamed",
  "injections",
  "bracing",
  "shoulders",
  "jaundice",
  "june",
  "muscle relaxant",
  "thighs",
  "prickling",
  "knee replacement",
  "humid",
  "clumsy",
  "dark",
  "hepatitis",
  "tai chi",
  "refreshed",
  "aching",
  "bilirubin",
  "dreadful fatigue",
  "cirrhosis",
  "constipation",
  "prostate cancer",
  "dehydrated",
  "stabbing",
  "restless at school",
  "tomatoes",
  "ointment",
  "clumsy",
  "brain fog",
  "dizziness",
  "handshake",
  "dark urine",
  "tendon",
  "big toe",
  "slurred",
  "continence",
  "neighbours",
  "driving",
  "savoury",
  "weight",
  "diarrhoea",
  "baggage handler",
  "luggage",
  "tired",
  "vitiligo",
  "vertigo",
  "commercial artist",
  "strength",
  "laxatives",
  "cycling",
  "junk food",
  "climbing stairs",
  "jaw exercise",
  "underactive thyroid",
  "swelling",
  "uric acid",
  "osteoporosis",
  "big toe",
  "software designer",
  "lifting weights",
  "calcium",
  "constipation",
  "preventive measures",
  "femur",
  "irritable bowel syndrome",
  "ulcerative colitis",
  "gastric reflux",
  "menopause",
  "cholesterol",
  "sprain",
  "colonoscopy",
  "pressure",
  "constipation",
  "glandular fever",
  "sweating",
  "sepsis",
  "dental hygienist",
  "jaundice",
  "blood thinners",
  "insomnia",
  "bitter taste",
  "gallstone",
  "discolouration",
  "sodium",
  "magnesium",
  "potassium",
  "burning",
  "environmental engineer",
  "stiff",
  "hand cream",
  "itching",
  "eczema",
  "sprained ankle",
  "scalp",
  "panic attack",
  "swollen",
  "dressing",
  "pressure",
  "temperature",
  "tetanus vaccination",
  "sepsis",
  "financial difficulties",
  "difficult",
  "different",
  "deficiency",
  "depression",
  "deafness",
  "awareness",
  "brain fog",
  "sharp mind",
  "bereavement",
  "surgery",
  "osteomyelitis",
  "stroke",
  "vascular",
  "nail",
  "opioids",
  "stiffness",
  "fainting",
  "pelvic ultrasound",
  "cramps",
  "clots",
  "child care assistant",
  "retirement",
  "dancing",
  "cranberry supplement",
  "blurring",
  "energy",
  "dizzy",
  "lower back",
  "ice packs",
  "nausea",
  "ankle",
  "hopelessness",
  "lethargic",
  "tingling",
  "ovarian cysts",
  "tingling sensation",
  "rubbing ointment",
  "tiger balm",
  "unsteady",
  "blurred vision",
  "paracetamol",
  "shoulder",
  "badminton",
  "blotchy",
  "jet lag",
  "wrists",
  "toe",
  "tarsal fracture",
  "hips",
  "joints",
  "ribs",
  "gout",
  "clammy",
  "chest pain",
  "calves",
  "throat cancer",
  "ginseng",
  "botox",
  "lethargy",
  "warehouse",
  "triptan",
  "stiff",
  "weakness",
  "guitar",
  "basketball",
  "imbalance",
  "prediabetes",
  "heavy",
  "weightlifting",
  "pins and needles",
  "energy",
  "ferritin",
  "amino acid",
  "panic attack",
  "dandruff",
  "bald patches",
  "anxiety attacks",
  "growing pain",
  "hotel receptionist",
  "poliovirus",
  "thyroid function test",
  "hormonal imbalance",
  "bald patches",
  "scabbing",
  "scabies",
  "beta blockers",
  "acoustic neuroma",
  "stuttered",
  "right knee",
  "bunion",
  "crutches",
  "hammer",
  "type 1 diabetes",
  "web designer",
  "freelancer journalist",
  "distorted",
  "stationary life",
  "DM",
  "trapped nerve.",
  "incontinence",
  "gout",
  "sedentary life",
  "omega-3",
  "hip",
  "groin",
  "tongue",
  "crutches",
  "hammer",
  "tongue",
  "lump",
  "right knee",
  "blurred vision",
  "stutter",
  "vegetarian",
  "big toes",
  "sleep apnoea",
  "kidney disease",
  "chiropractor",
  "graphic designer",
  "swimming",
  "rash",
  "bending over",
  "dairy products",
  "ears",
  "osteoarthritis",
  "intense burning",
  "breastfeeding",
  "translator",
  "voice",
  "knees",
  "scoliosis",
  "fertility",
  "absence seizures",
  "fractured rib",
  "balance",
  "playing squash",
  "whiplash",
  "mouse",
  "acupuncture",
  "accountant",
  "appendicitis",
  "dandruff",
  "an underactive thyroid",
  "depression",
  "gout",
  "pelvic congestion",
  "chest pain",
  "mild fever",
  "bone loss in jaw",
  "web designer",
  "canker sores",
  "lupus",
  "epilepticus",
  "Whipple’s disease",
  "gastroenterology",
  "involuntary",
  "tonic-clonic",
  "pepper",
  "peppermint",
  "cricket",
  "tremor",
  "uncomplicated pregnancy",
  "reflexes",
  "imitating",
  "breakfast",
  "rely on",
  "exacerbate",
  "housewife",
  "neighbour",
  "work",
  "patchy",
  "jaundice",
  "hepatitis",
  "steroid cream",
  "cirrhosis",
  "inflammatory",
  "inflammation",
  "inflamed",
  "exercise",
  "stress",
  "constipation",
  "brain fog",
  "swallowing",
  "vegan",
  "prostate cancer",
  "constipation",
  "dark",
  "bilirubin",
  "uterine caner",
  "big toe",
  "light",
  "regular",
  "ultrasound",
  "osteoporosis",
  "arthritis",
  "uterine balloon therapy",
  "preventative medicine",
  "miscarriages",
  "high-impact sport",
  "sciatica",
  "uric acid",
  "sprain",
  "femur",
  "laser",
  "constipation",
  "traumatic",
  "bad haemorrhage",
  "bend it",
  "brownish",
  "financial advisor",
  "breastfeeding",
  "ultrasound",
  "bent",
  "software designer",
  "vomiting",
  "appetite",
  "cholesterol",
  "calcium",
  "menopause",
  "shockwave surgery",
  "colonoscopy",
  "ulcerative colitis",
  "reflux",
  "boxing",
  "groin",
  "financial advisor",
  "homemaker",
  "osteoporosis",
  "arthritis",
  "constipation",
  "regular",
  "brownish",
  "dull ache",
  "food poisoning",
  "software designer",
  "anxiety",
  "gastric reflux",
  "workaholic",
  "electric",
  "shock",
  "menopause",
  "irritable bowel syndrome",
  "calcium",
  "cholesterol",
  "seafood",
  "groin",
  "nausea",
  "shower gel",
  "itchy",
  "fatigue",
  "deodorant",
  "Alzheimer's",
  "chickenpox",
  "thighs",
  "nasal spray",
  "programmer",
  "obese",
  "herbal oil",
  "red meat",
  "calamine lotion",
  "spotting",
  "sitting down",
  "journalist",
  "concentrate",
  "needles",
  "cervical cancer",
  "spirometry",
  "steroids",
  "excessive exercise",
  "osteoarthritis",
  "bruise",
  "heel",
  "translator",
  "oil paints",
  "atrial fibrillation",
  "layout",
  "heartbeats",
  "clothes",
  "broken ribs",
  "rib cage",
  "deep vein thrombosis",
  "yoga",
  "compartment syndrome",
  "visual perception",
  "vitamin D",
  "gluten",
  "Japan",
  "withdrawn",
  "walking frame",
  "ear infection",
  "slurred",
  "blurred",
  "movement",
  "climbing upstairs",
  "commercial artist",
  "heaviness",
  "eczema",
  "shingles",
  "speaking",
  "itchy",
  "burning",
  "calamine lotion",
  "eczema",
  "shingles",
  "deodorant",
  "shower gels",
  "nasal spray",
  "programmer",
  "thighs",
  "red meat",
  "strength",
  "intense",
  "cycling",
  "junk food",
  "neighbour",
  "incontinence",
  "jaw",
  "obese",
  "slow",
  "paralysis",
  "wedding",
  "watery",
  "pleurisy",
  "software developer",
  "wisdom teeth",
  "stroke",
  "anxiety",
  "sleep apnoea",
  "beauty therapist",
  "faint",
  "cycling",
  "stairs",
  "psoriasis",
  "stabbing",
  "bronchitis",
  "pleurisy",
  "presentation",
  "graft",
  "fatigue",
  "dyspepsia",
  "engineer",
  "seizures",
  "high-need baby",
  "eyelids",
  "vitamin B6",
  "botox",
  "rheumatic fever",
  "twin sister",
  "dental hygienist",
  "tremor",
  "cleft lip",
  "grommet",
  "mushroom",
  "endometriosis",
  "uncooperative",
  "picky",
  "behaviour",
  "muscle tones",
  "waking scheduled",
  "judo",
  "waved hand.",
  "arms",
  "armpit",
  "bipolar",
  "sweat",
  "shoulder",
  "diarrhoea",
  "epilepsy",
  "biologist",
  "depression",
  "blister",
  "hockey",
  "taste",
  "headache",
  "floppy",
  "elbow joint",
  "both calves",
  "backhand",
  "ointment",
  "systemic lupus",
  "steroid",
  "vertigo",
  "juvenile rheumatoid arthritis",
  "blindness",
  "greasy",
  "dandruff",
  "warm compression",
  "styes",
  "tea tree oil",
  "stinging",
  "computer programmer",
  "serious wrist fracture",
  "dental assistant",
  "osteoarthritis",
  "sour",
  "melatonin",
  "astigmatism",
  "white",
  "glue",
  "oral",
  "topical antibiotics",
  "omega-3",
  "mushrooms",
  "choking",
  "heartburn",
  "rubella",
  "salmonella",
  "blinking",
  "Meniere’s disease",
  "lunch",
  "16mg",
  "social gathering",
  "tinnitus",
  "stretching",
  "acute inflammation",
  "injections",
  "bracing",
  "shoulders",
  "regurgitation",
  "jogging",
  "dog trainer",
  "acoustic neuroma",
  "whisper",
  "whispering",
  "stuttered",
  "hammer",
  "repeat",
  "rheumatoid",
  "fever",
  "web designer",
  "groin",
  "echocardiogram",
  "lupus",
  "incontinence",
  "constricted",
  "hacking",
  "asthma",
  "pleurisy",
  "repetitive nerve stimulation",
  "drooping eyelid",
  "prostate cancer",
  "oat",
  "heavy lifting",
  "kidney stones",
  "steroid tablet",
  "right knee",
  "plenty fluids",
  "cholesterol",
  "stomach cramps",
  "wrist joint",
  "slurred speech",
  "chest infection",
  "ventilator",
  "flu vaccine",
  "chewing",
  "thymus gland",
  "badminton sport",
  "anxiety",
  "double vision",
  "achilles tendon",
  "spitting",
  "shoulder dystocia",
  "pre-eclampsia",
  "fever",
  "knees",
  "hips",
  "nursery",
  "tummy ache",
  "chest X-ray",
  "constipation",
  "topical antibiotics",
  "swollen",
  "panic attack",
  "dressing",
  "pressure",
  "two toes",
  "temperature",
  "tetanus vaccine",
  "sepsis",
  "financial difficulties",
  "depression",
  "deafness",
  "awareness",
  "brain fog",
  "sharp brain",
  "bereavement",
  "surgery",
  "arthritis",
  "diabetes",
  "vascular",
  "angina",
  "stroke",
  "call centre",
  "translator",
  "left ventricle",
  "obesity",
  "blurred vision",
  "stage 3",
  "scuba diving",
  "leukaemia",
  "vascular dementia",
  "convenient foods",
  "swimming",
  "voice",
  "ears",
  "sinuses",
  "scoliosis",
  "fertility",
  "absence seizures",
  "fractured rib",
  "balance",
  "convenience diet",
  "stiff",
  "weakness",
  "energy",
  "basketball",
  "left thigh",
  "longstanding",
  "dark red",
  "eczema",
  "bandage",
  "alcohol",
  "hypertension",
  "heavy",
  "dairy",
  "herbalist",
  "pain",
  "ice packs",
  "pins and needles",
  "stiffened",
  "left ankle",
  "poliovirus",
  "hydrocortisone",
  "standing up",
  "smell",
  "numbness",
  "growing pains",
  "cortisone cream",
  "dairy products",
  "weightlifting",
  "dementia",
  "left ventricular hypertrophy",
  "absence seizure",
  "convenience food",
  "coughing fits",
  "chest",
  "canal",
  "calves",
  "thighs",
  "2 toes",
  "warehouse",
  "abdomen",
  "piercing headache",
  "fatigue",
  "anaemia",
  "leathery",
  "botox",
  "hip joint",
  "wheezing",
  "pus",
  "blotchy",
  "gout",
  "beta blockers",
  "rash",
  "bald patch",
  "ibuprofen",
  "dengue fever",
  "coordination",
  "eyes",
  "thyroid function",
  "hormonal imbalance",
  "anxiety attack",
  "hotel receptionist",
  "urinating",
  "ferritin",
  "epilepsy",
  "collarbone",
  "blue limbs",
  "cracked lips",
  "bloodshot",
  "irritated",
  "gout",
  "carpenter",
  "vibration",
  "tingling",
  "short of breath",
  "acupuncture",
  "accountant",
  "hiking",
  "cycling",
  "peanut",
  "underactive thyroid",
  "high-fibre diet",
  "droopy",
  "bloating",
  "bladder",
  "fitness",
  "sciatica",
  "pelvic congestion",
  "appendicitis",
  "fibre diet",
  "antidepressant",
  "kidney graft",
  "embolisation",
  "peanut allergy",
  "hockey",
  "security guard",
  "both knees",
  "ulcerative colitis",
  "headaches",
  "puberty",
  "traffic noise",
  "shellfish",
  "floating",
  "cheeks",
  "web organiser",
  "blood clots",
  "lung cancer",
  "colonoscopy",
  "jaundice",
  "june",
  "dark urine",
  "prostatic cancer",
  "insomnia",
  "pacemaker",
  "pulmonary embolism",
  "itchy",
  "saline drip",
  "concussion",
  "muscle",
  "heparin injections",
  "glandular fever",
  "yoga",
  "joint pain",
  "skin rash",
  "meningitis",
  "ribs",
  "driving instructor",
  "vertigo",
  "mini stroke",
  "concentrate",
  "kidney stone",
  "housebound",
  "groin area",
  "scarlet fever",
  "collarbone",
  "blue limbs",
  "cracked lips",
  "bloodshot",
  "irritated",
  "gout",
  "bilirubin",
  "sticky eyes",
  "booster injection",
  "febrile convulsion",
  "cirrhosis",
  "dizziness",
  "uncomfortable stomach",
  "cataract",
  "tea",
  "ketogenic",
  "right thumb",
  "perfumed",
  "hip replacement",
  "alternative therapy",
  "cold water",
  "dry",
  "flaky",
  "blisters",
  "awful",
  "blood transfusion",
  "throat infection",
  "hydrated",
  "bicycle",
  "left thumb",
  "flight attendant",
  "beer",
  "bearable",
  "gluten",
  "gluten-free diet",
  "hydration",
  "tonsillitis",
  "tonsil",
  "withdrawn",
  "limping",
  "upper limb",
  "shoulder",
  "knife",
  "ankles",
  "handwriting",
  "healthy",
  "gallstones",
  "gallbladder",
  "muscles",
  "back",
  "incontinence",
  "sister",
  "drive",
  "aerobics",
  "anaerobic",
  "sugar",
  "exam",
  "sepsis",
  "multiple system failure",
  "peritonitis",
  "right thumb",
  "steroid",
  "stomach pain",
  "stomach ache",
  "hernia",
  "ventilation",
  "colostomy",
  "colonoscopy",
  "stoma",
  "cholesterol",
  "multiple organ failure",
  "menopause",
  "growing pain",
  "arthritis",
  "flat mattress",
  "coma",
  "loosing",
  "losing weight",
  "abdominal pain",
  "dark red urine",
  "nosebleed",
  "verapamil",
  "vegetarian diet",
  "vegetables",
  "vegan",
  "tooth extraction",
  "cauterisation",
  "cardiologist",
  "cholecystectomy",
  "golf ball",
  "restless legs syndrome",
  "scar",
  "aspiration",
  "burning",
  "fish oil",
  "zinc",
  "humidity",
  "stiffness",
  "pregnancy",
  "clicking",
  "drill",
  "mood swing",
  "typically",
  "constant pain",
  "fracture",
  "jewellery maker",
  "carpal tunnel syndrome",
  "burning sensation",
  "nausea",
  "gardener",
  "floppy",
  "tongue",
  "earache",
  "spasms",
  "gums",
  "exhaustion",
  "breast cancer",
  "femur",
  "hay fever",
  "project manager",
  "patches",
  "scarlet fever",
  "antacid",
  "craving",
  "pus",
  "hard",
  "lighter",
  "financial advisor",
  "frontal lobe",
  "seizure",
  "Meniere’s disease",
  "preventer",
  "fuzzy",
  "loss of hearing",
  "social gathering",
  "propranolol",
  "tetanus",
  "pancreatitis",
  "antifungal",
  "mechanic",
  "vomiting",
  "sinus infection",
  "ladder",
  "rotator cuff",
  "co-codamol",
  "tonic-clonic",
  "complex partial",
  "VNS therapy",
  "heparin injections",
  "skin rashes",
  "joint pain",
  "concussions",
  "anti-inflammatory",
  "ethanol",
  "carbohydrates",
  "golf",
  "neck",
  "antihistamine",
  "thyroid",
  "steroid injection",
  "uterine cancer",
  "uterine balloon",
  "right shoulder",
  "light bleeding",
  "environmental engineering",
  "scalp",
  "saline drip",
  "hand cream",
  "ointment",
  "kidney stone",
  "insomnia",
  "bump on the head",
  "trance",
  "malarone tablets",
  "administrator",
  "coconut oil",
  "muscular dystrophy",
  "chubby",
  "deodorant",
  "chins",
  "lifting things",
  "beeswax",
  "contiguous",
  "biopsy",
  "swollen tongue",
  "multiple sclerosis",
  "calamine lotion",
  "perfumes",
  "pink eye",
  "ammonia",
  "lobe",
  "type of viruses",
  "aching",
  "acute inflammation",
  "anti-clockwise",
  "antifungal",
  "antiseptic shampoo",
  "antisocial",
  "awareness",
  "back ankle",
  "beeswax",
  "bend",
  "bend over",
  "bereavement",
  "beta blockers",
  "bout",
  "bouts of vomiting",
  "brain fog",
  "bruising",
  "bump",
  "central nervous system",
  "chickenpox",
  "chills",
  "chin",
  "chapped lips",
  "clothes",
  "coconut oil",
  "cold compressor",
  "colouring",
  "compartment syndrome",
  "counselling",
  "crackling sounds",
  "deafness",
  "deep vein thrombosis",
  "dermatitis",
  "deteriorate",
  "diabetes",
  "dialysis",
  "down syndrome",
  "dressing",
  "EEG (electroencephalogram)",
  "engineering",
  "excruciated",
  "eyebrows",
  "falling",
  "finance",
  "financial",
  "financial difficulties",
  "fingers",
  "freeze",
  "joint pain",
  "glaucoma",
  "graphic designer",
  "groggy",
  "hearing loss",
  "heat pads",
  "heparin injection",
  "herbal oil",
  "impaction",
  "injection",
  "invasive",
  "invitations",
  "iron deficiency",
  "Japan",
  "jobbing",
  "jabbing",
  "gapping",
  "judge distance",
  "kidney",
  "layout",
  "life-threatening",
  "lifting",
  "loss of energy",
  "lunchtime",
  "magazine editor",
  "malaria",
  "malaria tablets",
  "meals",
  "lunch",
  "launch",
  "mild fever",
  "mouth ulcers",
  "nail",
  "nasal spray",
  "nightmares",
  "normal",
  "off-colour",
  "oil paint",
  "opioid",
  "optic disc",
  "perception",
  "pounding sound",
  "pressure",
  "prevention",
  "psychological assessment",
  "radiotherapy",
  "red meat",
  "SLE (systemic lupus erythematosus)",
  "salad",
  "self-conscious",
  "shadow",
  "sharp brain",
  "shooting",
  "shower gels",
  "skin rash",
  "spots",
  "steroid injections",
  "superior aspect",
  "temperature",
  "tension headaches",
  "tetanus vaccine",
  "thyroid disease",
  "toys",
  "twisting",
  "two toes",
  "vascular",
  "vertigo",
  "vision",
  "vitamin D",
  "vocabulary",
  "preventer",
  "agitated",
  "attack",
  "autoimmune",
  "bending over",
  "bilirubin",
  "bouncing sounds",
  "brain scan",
  "chubby",
  "cleaner",
  "clumps",
  "concentration",
  "concentrate",
  "confused",
  "confusion",
  "croup",
  "dark",
  "ear glue",
  "eyebrows",
  "fine",
  "gout",
  "hairdresser",
  "hives",
  "hysterectomy",
  "irritable",
  "jaundice",
  "lemonade",
  "menstruation",
  "night sweat",
  "fever",
  "oranges",
  "oxygen",
  "coconut oil",
  "headaches",
  "breathless",
  "muscular dystrophy",
  "chubby",
  "deodorant",
  "headaches",
  "chins",
  "lifting things",
  "beeswax",
  "contiguous",
  "twisting",
  "biopsy",
  "arthritis",
  "swimming",
  "magazine editor",
  "withdrawn",
  "Japan",
  "visual perception",
  "clothes",
  "frightening",
  "layout",
  "oil paint",
  "finances",
  "prostate cancer",
  "sales manager",
  "seizures",
  "sense of balance",
  "sensitive to light",
  "shooting pain",
  "respiratory infection",
  "laparoscopy",
  "pelvic inflammatory disease",
  "fallopian tubes",
  "appendix",
  "appendicectomy",
  "appendicitis",
  "miscarriage",
  "shopping",
  "sprain",
  "thyroxine",
  "tightness",
  "unsteady",
  "weight gain",
  "hip",
  "tummy pain",
  "belly pain",
  "spitting",
  "ultrasound",
  "shoulder dystocia",
  "pre-eclampsia",
  "X-ray",
  "warm compress",
  "blinking",
  "glue",
  "antibiotic",
  "computer programmer",
  "astigmatism",
  "sit",
  "tea tree oil",
  "white",
  "omega-3",
  "dilantin",
  "rhinocort nasal spray",
  "mucofen",
  "flurbiprofen",
  "klonopin",
  "rivaroxaban",
  "mitomycin",
  "flomax",
  "advair diskus",
  "celebrex",
  "neurontin",
  "cyclophosphamide",
  "allopurinol",
  "morphine",
  "zolpidem",
  "nitroglycerin",
  "clopidogrel",
  "keflex",
  "atenolol",
  "sodium",
  "bicarbonate",
  "neoprene",
  "cardizem",
  "metoprolol",
  "hydralazine",
  "labetalol",
  "hydrochlorothiazide",
  "zyrtec",
  "proscar",
  "synthroid",
  "motrin",
  "avelox",
  "codeine",
  "chlordiazepoxide",
  "clindinium",
  "simvastatin",
  "flagyl",
  "daptomycin",
  "primaxin",
  "methadone",
  "levaquin",
  "itchy",
  "programmer",
  "red meat",
  "calamine lotion",
  "memory",
  "concussion",
  "joints pain",
  "freeze",
  "tetanus",
  "acute inflammation",
  "anti-clockwise",
  "antispasmodic",
  "disc prolapse",
  "firefighter",
  "co-codamol",
  "corticosteroid injection",
  "antihistamine",
  "c-reactive protein",
  "financial advisor",
  "juvenile rheumatic arthritis",
  "earache",
  "cheese",
  "carpal tunnel syndrome",
  "fractures",
  "echocardiogram",
  "fluid",
  "salads",
  "kidney transplant",
  "life-threatening",
  "finances",
  "itchy leg",
  "nosebleeds",
  "dry cough",
  "dull ache",
  "aggressive",
  "elbow",
  "CBT",
  "punctured lung",
  "smoke inhalation",
  "cellulitis",
  "blood test",
  "memory lapse",
  "fidget",
  "strengthening exercises",
  "stumbling",
  "aneurysm",
  "sides of buttocks",
  "physiotherapy",
  "bearable",
  "bank manager",
  "liver cancer",
  "eyes",
  "migraines",
  "acupuncture",
  "blotches",
  "migraine",
  "ace inhibitors",
  "cracked",
  "brown marks",
  "big toe",
  "arthritis",
  "baclofen",
  "high-impact sports",
  "layout",
  "darker",
  "frightening",
  "vibrating tool",
  "carpenter",
  "restricted diet",
  "corticosteroids",
  "allergy",
  "pruritus",
  "orange",
  "sales manager",
  "seizures",
  "sense of balance",
  "sensitive to light",
  "shooting pain",
  "respiratory infection",
  "laparoscopy",
  "pelvic inflammatory disease",
  "fallopian tubes",
  "appendix",
  "miscarriage",
  "shopping",
  "sprain",
  "thyroxine",
  "tightness",
  "unsteady",
  "weight gain",
  "hip",
  "tummy pain",
  "spitting",
  "ultrasound",
  "shoulder dystocia",
  "pre-eclampsia",
  "X-ray",
  "warm compress",
  "dry crackers",
  "glands",
  "throat",
  "mood swings",
  "excruciating",
  "anti-inflammatory",
  "anti-inflammatories",
  "anterior nasal packing",
  "muscle fasciculation",
  "exacerbated",
  "medial cruciate ligament",
  "anterior drawer test",
  "ablation",
  "abrasion",
  "genetic",
  "abdominal rigidity",
  "vomiting",
  "stomach suction",
  "tachycardia",
  "energy levels",
  "cardiomyopathy",
  "angiogram",
  "fluid",
  "echocardiogram",
  "graft",
  "pelvic inflammatory disease",
  "PPI",
  "condoms",
  "calcium deficiency",
  "chest X-ray",
  "engineer",
  "muscular dystrophy",
  "urge",
  "flat",
  "tomato",
  "vomiting",
  "Cognitive Behavioural Therapy",
  "dull aching",
  "smoke inhalation",
  "trial and error",
  "cortisone",
  "liver cancer",
  "ACE inhibitor",
  "steroid cream",
  "itchiness",
  "belching",
  "bloated",
  "sturdy shoes",
  "blocked up",
  "headache",
  "suppository",
  "flu ",
  "whistling",
  "congestion",
  "angioplasty",
  "aspirin",
  "squinting",
  "OCD",
  "ECG",
  "turnover",
  "fluoxetine (antidepressant)",
  "a little bit stressed",
  "flossing teeth",
  "extensive food allergy test",
  "treatment",
  "oral medications",
  "short-sighted",
  "short-sightedness",
  "prenatal bruising",
  "osteopathic chair",
  "ibuprofen",
  "prilosec",
  "persistent",
  "unpredictable",
  "prolapsing",
  "botox",
  "throbbing pain",
  "untreatable",
  "maternal screening",
  "administration via a pump",
  "tingling sensation",
  "ineffective",
  "puffing",
  "fetoprotein",
  "bloating sensation",
  "free beta-hcg",
  "electrical impulse",
  "combination of treatment",
  "frequent",
  "inhibin A",
  "antiviral cream",
  "flare-up of scratchy",
  "asthmatic inhalers",
  "stiff feeling in neck",
  "weepy (eye)",
  "amniocentesis",
  "laser",
  "penicillin",
  "amoxicillin",
  "swallowing difficulty",
  "disappointed",
  "amniotic level",
  "LASIK surgery",
  "injection",
  "loss of memory",
  "overwhelmed",
  "coagulation profile",
  "herbal medicines",
  "sore in throat",
  "iron studies",
  "implanted contact",
  "marijuana",
  "shortness of breath",
  "iron stores",
  "cotton bags",
  "recreational drugs",
  "illicit drugs",
  "bruises",
  "impaired amsler chart",
  "inguinal hernia repair",
  "sceptical",
  "echo",
  "bone grafting",
  "cover",
  "boldly forward",
  "airway device",
  "malarone",
  "frustrating",
  "cholesterol level",
  "melfoquine",
  "bone marrow biopsy",
  "doxycycline",
  "CT scan",
  "PET scan",
  "chloroquine",
  "OTC",
  "date and time",
  "diet",
  "disease",
  "family members",
  "referral",
  "noun",
  "months",
  "fibres",
  "father",
  "nutritionist",
  "leaflet",
  "weeks",
  "OCD",
  "mother",
  "pharmacy",
  "days",
  "meat lovers",
  "MI",
  "aunt",
  "social worker",
  "light",
  "couple of months",
  "spinach",
  "transposition of great vessels",
  "unclean",
  "optometrist",
  "2 times",
  "vegetarian",
  "common cold",
  "brother",
  "ophthalmologist",
  "heavy suitcase",
  "carnivore",
  "obstetrician",
  "gynaecologist",
  "paediatrician",
  "contact lens",
  "leafy green",
  "daughter",
  "rigid contacts",
  "vegetables",
  "removal solution",
  "hobbies",
  "egg",
  "cousin",
  "senior special cleaner",
  "soccer ball",
  "milk",
  "yoghurt",
  "IBD",
  "nephew",
  "cornea",
  "rugby ball",
  "melanoma",
  "melatonin",
  "chaotic",
  "ballet dancing",
  "soya",
  "grandma",
  "audiologist",
  "lubricant",
  "cycling",
  "salmon",
  "slipped disc",
  "grandpa",
  "paediatric dentist",
  "microkeratome",
  "running",
  "tuna",
  "high fever",
  "knee",
  "reading glasses",
  "riding",
  "bread",
  "GP",
  "waviness in reading",
  "jogging",
  "macular degeneration",
  "dermatologist",
  "phone book",
  "dumbbells",
  "care assistant",
  "pigments in retina",
  "thalassemia",
  "events organiser",
  "professional",
  "auditory",
  "brainstem",
  "cricket",
  "anaemia",
  "executive director",
  "physician",
  "optic nerve",
  "hair cell death",
  "batteries",
  "hockey",
  "high school teacher",
  "neuropath",
  "silicon tubes",
  "hemochromatosis",
  "engineer",
  "rubber tubes",
  "retailer",
  "gingivitis",
  "full-time job",
  "leaking valve",
  "periodontal disease",
  "gum lump",
  "lumpectomy",
  "burnout",
  "infertility",
  "PSA",
  "tonsillectomy",
  "dental caries or decay",
  "mental orphanage",
  "meniscectomy",
  "emphysema",
  "lethargy",
  "sunbeds",
  "nephrectomy",
  "obstructive shock",
  "pallor",
  "awareness",
  "HIV test",
  "sunscreen",
  "giardia",
  "dysponea",
  "motivation",
  "MRI",
  "massage",
  "stress",
  "ECG",
  "treadmill",
  "splenectomy",
  "spleen",
  "amoebic dysentery",
  "mental well-being",
  "prolactin",
  "appendectomy",
  "HTLV-1 virus",
  "bereavement",
  "LH kit",
  "nauseous",
  "nausea",
  "chest tightness",
  "Cognitive Behavioural Therapy",
  "sperm",
  "cystoprostatectomy",
  "typhoid fever",
  "masticatory muscle",
  "BMD test",
  "mechanical ventilatory support",
  "holter monitor",
  "coronary stent",
  "dull aching",
  "strain",
  "tylenol",
  "mammogram",
  "carotid Doppler",
  "carvedilol",
  "BRCA",
  "chemical cauterisation",
  "furosemide",
  "conjunctival",
  "pallor ",
  "Cognitive Behavioural Therapy",
  "icterus",
  "dysmetria",
  "amlodipine",
  "carotid bruits",
  "mastectomy",
  "lightheaded",
  "lightheadedness",
  "ranitidine",
  "renal scintigraphy",
  "osteoporosis",
  "loud snoring",
  "transvaginal probe",
  "pigeon toe",
  "wax and wane",
  "exacerbate",
  "cerebral palsy",
  "electric shock",
  "volvulus",
  "diabetic retinopathy",
  "myopia",
  "hypermetropia",
  "hereditary spherocytosis",
  "autism",
  "neonate",
  "pre-eclampsia",
  "narcissistic personality disorder",
  "D-dimer",
  "schizophrenia",
  "romberg test",
  "lumbar lordosis",
  "ejection fraction",
  "xerostomia",
  "allergic contact dermatitis",
  "nauseous",
  "hydroquinone",
  "seborrhoeic dermatitis",
  "tamoxifen",
  "scabies",
  "lichen simplex",
  "cramps",
  "claritin",
  "angioedema",
  "nutritionist",
  "augmentin",
  "small meals",
  "necrotising fasciitis",
  "special food like yoghurt",
  "alopecia",
  "ADHD",
  "pool of porridge",
  "Raynaud’s phenomenon",
  "banana",
  "postherpetic neuralgia",
  "apple",
  "lyme disease",
  "sushi",
  "ischaemic colitis",
  "tuna",
  "Alzheimer's",
  "dried fruits",
  "hypochondria",
  "resin",
  "haemophilia",
  "apricot",
  "skin prick testing",
  "lamb meat",
  "veal meat",
  "glipizide",
  "clotting factor",
  "rice",
  "pasta",
  "onion",
  "metoprolol",
  "lactose",
  "zyrtec",
  "winds",
  "detrol",
  "diarrhoea",
  "fluticasone spray",
  "raffinose onion",
  "pantoprazole",
  "cabbage",
  "warfarin",
  "neurontin",
  "fructose",
  "glucose",
  "premarin",
  "wheat",
  "oestradiol",
  "oestrogen",
  "starch",
  "dexamethasone",
  "pear",
  "pineapple",
  "kiwi",
  "citrus fruit",
  "oxycontin",
  "cephalosporin",
  "tendon",
  "freak",
  "buttoning",
  "carry on",
  "fomites",
  "utensil",
  "eye symptoms",
  "short-sightedness",
  "myopia",
  "foggy window",
  "retinal detached",
  "glasses",
  "coloured contact lenses",
  "eye drops",
  "vitrectomy",
  "laser therapy",
  "glare",
  "twitch",
  "nystagmus",
  "ulcer",
  "conjunctivitis",
  "macular degeneration",
  "photophobia",
  "corneal abrasion",
  "optometrist",
  "drooping eyelid",
  "vitreous",
  "brain fog",
  "breastbone",
  "sternum",
  "pectus excavatum",
  "funnel chest",
  "collarbone",
  "clavicle",
  "shoulder blade",
  "scapula",
  "drooping",
  "dropping",
  "feel dizzy",
  "high voice or sound",
  "viral infection",
  "central nervous system",
  "labourer",
  "flaky skin",
  "dry skin",
  "greasy stool",
  "advair diskus",
  "siblings",
  "colace",
  "BOSU ball",
  "pelvic inflammatory disease",
  "faint",
  "aggressive",
  "elbow",
  "CBT",
  "punctured lung",
  "smoke inhalation",
  "cellulitis",
  "stiff",
  "tingling",
  "lax abdomen",
  "tender abdomen",
  "barking cough",
  "nasty cough",
  "sperm banking",
  "get into a state",
  "sponge bath",
  "blowing",
  "roaring",
  "buzzing",
  "hissing",
  "humming",
  "breakthrough pain",
  "clogged ear",
  "clogged nose",
  "bacon",
  "crippled",
  "lean meat",
  "processed meat",
  "feeling woozy",
  "investigations",
  "growth spurt",
  "habit-forming",
  "addictive",
  "fluorescein",
  "hacking cough",
  "whooping cough",
  "forceps",
  "impending sensation of death",
  "scheduled",
  "intensified",
  "sham",
  "intermenstrual",
  "post-coital bleeding",
  "coital",
  "coitus",
  "jarring injury",
  "movements",
  "body parts",
  "jerking movements",
  "abdominal girth",
  "knee clicking",
  "popping sound",
  "armpit",
  "lethargy",
  "belly",
  "tummy",
  "lightheadedness",
  "bum cheek",
  "loosened stool",
  "loosened bowel movements",
  "ear",
  "moaning",
  "iliopsoas",
  "muffled",
  "lamina propria",
  "niggling",
  "nagging",
  "loin",
  "oozing of blood",
  "overwhelmed",
  "overwhelming",
  "slime",
  "panicky",
  "sole of foot",
  "palm of hand",
  "pass sand in stool",
  "supine",
  "prone",
  "pinch",
  "pinched",
  "trapped nerve",
  "toe",
  "pinchable",
  "pitting oedema",
  "waist",
  "prickling",
  "womb",
  "uterus",
  "scald",
  "scalded",
  "adhesive",
  "searing pain",
  "ambulate",
  "ambulance",
  "seborrhoeic",
  "auditory",
  "short-sighted",
  "blend",
  "skin tag",
  "boil",
  "burrow",
  "hair grain",
  "brace",
  "slipped",
  "slip",
  "twisted disc",
  "bone",
  "breech",
  "slurred",
  "slurring speech",
  "chaotic",
  "chaos",
  "sneezing",
  "chores",
  "soaked",
  "soaking for periods",
  "climb",
  "soothe",
  "damp weather",
  "squinting",
  "dozen",
  "stabbing pain",
  "erratic",
  "sting ",
  "stung",
  "flip top",
  "burning pain",
  "guitar string",
  "feel full",
  "stomping gait",
  "scissoring gait",
  "festinating gait",
  "freezing gait",
  "waddling gait",
  "trendelenburg gait",
  "antalgic gait",
  "stooped gait",
  "stooping walk",
  "stooped posture",
  "hold",
  "striking",
  "kindergarten",
  "struvite stone",
  "maternity",
  "stutter",
  "stuttering",
  "momentum",
  "sudden burst",
  "mortgage",
  "symptoms subsided",
  "nimbly",
  "tartar",
  "overlook",
  "tear",
  "torn",
  "trim",
  "chop",
  "dice",
  "perspiration ",
  "sweating",
  "tearing",
  "ripping sensation",
  "terrible",
  "trouble",
  "terrible pain",
  "quiz",
  "throw up",
  "vomiting",
  "recuperation",
  "toothache",
  "spiritual",
  "unattainable",
  "susceptible",
  "unbearable",
  "intolerable",
  "sustainable",
  "venomous",
  "tease out",
  "vexing pain",
  "teeter",
  "worn out",
  "twinge",
  "worrisome",
  "vulnerable",
  "lethargy",
  "moaning",
  "moan",
  "sore throat",
  "stiffness",
  "dizzy",
  "dizziness",
  "sleepy",
  "sleepiness",
  "nausea",
  "headache",
  "back pain",
  "cough",
  "fever",
  "cold",
  "chills",
  "sweating",
  "shortness of breath",
  "fatigue",
  "numbness",
  "tingling",
  "pain relief",
  "health check-up",
  "hospitalisation",
  "treatment",
  "pneumonia",
  "eczema",
  "urgency",
  "murmur",
  "strangulation",
  "anxiety",
  "convulsions",
  "saline drip",
  "ethanol",
  "fitful",
  "cloudy",
  "barium enema",
  "barium meal",
  "palpitations",
  "caffeine",
  "decaffeinated",
  "graded exercise",
  "counsellor",
  "dilantin",
  "patches",
  "craving",
  "antacid",
  "lighter",
  "dialysis",
  "hydrated",
  "blood transfusion",
  "bandage",
  "junk food",
  "pre-diabetic",
  "squash",
  "uncomplicated",
  "epilepticus",
  "wisp",
  "losartan",
  "atacand",
  "metformin",
  "aspirin",
  "plavix",
  "omeprazole",
  "albuterol",
  "nasacort",
  "ritalin",
  "proscar",
  "multivitamin",
  "epipen",
  "mint tea",
  "mint leaves",
  "cod liver oil",
  "remedies",
  "decongestant",
  "moisturiser",
  "petroleum jelly",
  "barrister",
  "bartender",
  "labourer",
  "geneticist",
  "insurer",
  "kinesiologist",
  "osteopath",
  "chiropractic",
  "otolaryngologist",
  "podiatrist",
  "rheumatologist",
  "roof tiler",
  "sibling",
  "seller",
  "sailor",
  "darts playing",
  "sole guardian",
  "lorry driver",
  "spouse",
  "sibling",
  "amblyopia",
  "azotaemia",
  "bariatric",
  "bouts",
  "bulimia nervosa",
  "coeliac disease",
  "dumping syndrome",
  "dust mites",
  "scaly rash",
  "flaky",
  "head lice",
  "helicobacter pylori",
  "infarcts",
  "nocturnal",
  "nocturia",
  "odontalgia",
  "Bell's palsy",
  "oedema",
  "petechial rash",
  "phlegm",
  "plaque",
  "precocious puberty",
  "scurvy",
  "torsion",
  "wart",
  "athlete",
  "athletic",
  "baseball",
  "BOSU ball",
  "camping",
  "lawn mowing",
  "netball",
  "nordic walking",
  "rowing",
  "climbing",
  "rugby",
  "helmet",
  "skiing",
  "tournament",
  "fuzzy",
  "fuzziness",
  "aching",
  "aches",
  "agony",
  "misaligned",
  "breakthrough pain",
  "breast dimpling",
  "bullet",
  "burbling",
  "burp",
  "grip",
  "colicky pain",
  "breaking wind – flatulence",
  "cramping",
  "crusty mucus",
  "flickering",
  "growth spurt",
  "jarring injury",
  "bent knee",
  "popping sound",
  "cracking sound",
  "crackling sound",
  "crackling my knuckles",
  "knotted sensation",
  "lockjaw",
  "panic",
  "panicky",
  "tearing",
  "venomous",
  "hand splints",
  "handrails",
  "immobilisation boot",
  "imodium",
  "lice comb",
  "ecstasy",
  "MDMA",
  "motrin",
  "opiate mix",
  "padding",
  "pads and tampons",
  "peppermint oil",
  "pethidine",
  "prednisolone",
  "prednisone",
  "remedy",
  "remedies",
  "soap",
  "sour",
  "sore",
  "towel",
  "stick",
  "zoloft",
  "butter",
  "oat",
  "peanut",
  "crisps",
  "chips",
  "legumes",
  "regime",
  "milky puddings",
  "refined food",
  "soy",
  "soybean",
  "starch",
  "wheat",
  "rye",
  "barley",
  "barely",
  "processed meat",
  "cholangiogram",
  "cardiotocography",
  "colposcopy",
  "cystourethroscopy",
  "dietary",
  "down gaze",
  "horizontal gaze",
  "fluorescein",
  "forceps",
  "scheduled",
  "scintigraphy",
  "abdominal girth",
  "hamstrings",
  "quads",
  "achilles",
  "belly button",
  "navel",
  "calf",
  "umbilicus",
  "calves",
  "lean body",
  "hump",
  "slime",
  "prone",
  "supine",
  "waist",
  "waste",
  "adhesive",
  "breech",
  "cannabis",
  "overlook",
  "freak out",
  "utensils",
  "cousin",
  "sugar",
  "sales manager",
  "self-conscious",
  "aspiration",
  "zinc",
  "retirement",
  "constant pain",
  "scar",
  "scarring",
  "cortisone",
  "autoimmune",
  "anaesthesia",
  "analgesia",
  "urinary retention",
  "sphincter",
  "intravenous",
  "opioids",
  "surgery",
  "surgeon",
  "surgical",
  "ultrasonography",
  "traffic accident",
  "equipment",
  "reconstruction",
  "weight-bearing exercises",
  "elevation",
  "vocabularies",
  "abdominal rigidity",
  "stimulation",
  "enlarged prostate",
  "colostomy",
  "psoriasis",
  "tendonitis",
  "unpredictable",
  "fibre",
  "products",
  "anxious",
  "amnesia",
  "Baclofen",
  "untreatable",
  "herpes simplex",
  "frequent",
  "frequently",
  "events organiser",
  "hernia",
  "elbow creases",
  "loose stool",
  "sensitivity",
  "photophobia",
  "isolated",
  "debilitated",
  "induced coma",
  "sepsis",
  "dementia",
  "frontal lobe",
  "appetite",
  "compression stockings",
  "gastrectomy",
  "foam",
  "terrible",
  "noticeable",
  "asthma",
  "christmas",
  "insomnia",
  "stooped",
  "soothing ointment",
  "torn ligament",
  "independent",
  "twitch",
  "eyesight",
  "stretching",
  "resistance band",
  "aqueous gel",
  "temporary",
  "teenage",
  "evidence",
  "malignant",
  "coconut oil",
  "shivering",
  "stripping technique",
  "gripping",
  "keyboard",
  "platelets",
  "spontaneous",
  "haemoglobin",
  "end-stage renal failure",
  "dialysis",
  "tiny filters",
  "impairment",
  "abstain",
  "substance abuse",
  "abnormalities",
  "viral myocarditis",
  "ribs",
  "hypothyroidism",
  "mechanic",
  "recruitment consultant",
  "cervical cancer",
  "fingertips",
  "fingernails",
  "toenail",
  "popping sound",
  "deep vein thrombosis",
  "suppress",
  "gastric dumping syndrome",
  "thirsty",
  "incredibly",
  "bulging out",
  "security guard",
  "gradual",
  "reassurance",
  "muscle relaxants",
  "Parkinson’s disease",
  "recovery",
  "shifty",
  "ativan",
  "eases",
  "concentration",
  "psychiatrist",
  "anorexia nervosa",
  "chemotherapy",
  "separated",
  "cigarettes",
  "septoplasty",
  "nostril",
  "decongestant",
  "deviated septum",
  "invasion",
  "analgesic cream",
  "occupational therapist",
  "lukewarm",
  "crossfit",
  "sudden",
  "dope smoker",
  "hire car driver",
  "humidifier",
  "recurring lung infection",
  "sneezing",
  "intermittent",
  "stingy",
  "researcher",
  "grocery",
  "groggy",
  "distorted",
  "insect repellent",
  "stamina",
  "duodenal ulcer",
  "fidget",
  "agitated",
  "wasp sting",
  "hives",
  "condom",
  "crowded",
  "drowsy",
  "fatigued",
  "anticonvulsant",
  "statin",
  "severe",
  "searing pain",
  "aromatherapy",
  "air conditioning",
  "abscess",
  "glasses",
  "millilitre",
  "distended abdomen",
  "losartan",
  "temple",
  "shellfish",
  "strawberries",
  "fixation",
  "irritants",
  "pillow case",
  "district",
  "prescribed",
  "prescription",
  "tumour",
  "suicidal",
  "conservative",
  "phlegm",
  "cardiologist",
  "permanent",
  "protein",
  "apnoea",
  "fullness in ears",
  "businessman",
  "agoraphobia",
  "relieved",
  "affection",
  "tour guide",
  "ginger",
  "wrist",
  "lonely",
  "loneliness",
  "arrhythmia",
  "additional tests",
  "ketones",
  "gestational diabetes",
  "obesity",
  "contraception",
  "dysfunctional",
  "transvaginal ultrasound",
  "breathlessness",
  "acne",
  "meningococcal",
  "liquid morphine",
  "absorb",
  "malabsorption",
  "pouch",
  "intersection",
  "holidays",
  "malaise",
  "measles",
  "gassy",
  "strung",
  "rupture",
  "rapture",
  "electrolytes",
  "provocation",
  "eruption",
  "membrane",
  "NSAIDS",
  "discolouration",
  "double vision",
  "vaccinated",
  "instructor",
  "crutches",
  "jargon",
  "shin of tibia",
  "chin of the face",
  "contagious",
  "dengue fever",
  "pigment",
  "cataract",
  "detached retina",
  "attached",
  "glare",
  "glance",
  "eye floaters",
  "spots",
  "stretch marks",
  "varicose veins",
  "diaphragm",
  "diaphoresis",
  "dehydration",
]

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingComplete, setIsLoadingComplete] = useState(false)
  const [isFullScreenLoading, setIsFullScreenLoading] = useState(false)

  const [wordLists, setWordLists] = useState<WordList[]>([])
  const [currentList, setCurrentList] = useState<WordList | null>(null)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [userInput, setUserInput] = useState("")
  const [practiceScore, setPracticeScore] = useState(0)
  const [practiceAttempts, setPracticeAttempts] = useState(0)
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const randomOrder = false // Always sequential
  const [currentMode, setCurrentMode] = useState<"menu" | "list">("menu")
  const [practiceWords, setPracticeWords] = useState<Word[]>([])
  const [quizWords, setQuizWords] = useState<Word[]>([])
  const [practiceComplete, setPracticeComplete] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)
  const [savedProgress, setSavedProgress] = useState<{ [key: string]: number }>({})
  const [practiceStartIndex, setPracticeStartIndex] = useState(0)
  const [canNavigateBack, setCanNavigateBack] = useState(false)
  const [canNavigateForward, setCanNavigateForward] = useState(false)
  const [activeTab, setActiveTab] = useState<"list" | "practice" | "quiz" | "favourites">("list")
  const [startFromWordInput, setStartFromWordInput] = useState("")
  const [quizRepeatedWords, setQuizRepeatedWords] = useState<Set<number>>(new Set())
  const [favouriteWords, setFavouriteWords] = useState<Set<string>>(new Set())
  const [favouritesQuizWords, setFavouritesQuizWords] = useState<Word[]>([])
  const [favouritesQuizResults, setFavouritesQuizResults] = useState<QuizResult[]>([])
  const [favouritesQuizComplete, setFavouritesQuizComplete] = useState(false)
  const [favouritesQuizRepeatedWords, setFavouritesQuizRepeatedWords] = useState<Set<number>>(new Set())
  const [isInFavouritesQuiz, setIsInFavouritesQuiz] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showScrollArrow, setShowScrollArrow] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Initialize with empty word lists
    setWordLists([])
  }, [])

  useEffect(() => {
    // Load saved progress and favourites from localStorage
    const saved = localStorage.getItem("spellingProgress")
    if (saved) {
      try {
        setSavedProgress(JSON.parse(saved))
      } catch (error) {
        console.error("Error loading saved progress:", error)
      }
    }

    const savedFavourites = localStorage.getItem("favouriteWords")
    if (savedFavourites) {
      try {
        setFavouriteWords(new Set(JSON.parse(savedFavourites)))
      } catch (error) {
        console.error("Error loading favourite words:", error)
      }
    }
  }, [])

  // Intersection Observer for scroll arrow
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollArrow(!entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    const ctaElement = document.getElementById("cta")
    if (ctaElement) {
      observer.observe(ctaElement)
    }

    return () => {
      if (ctaElement) {
        observer.unobserve(ctaElement)
      }
    }
  }, [])

  // Save progress whenever it changes
  useEffect(() => {
    if (currentList && activeTab === "practice") {
      const progressKey = `${currentList.name}_progress`
      const currentSavedProgress = savedProgress[progressKey]

      // Only update if the progress actually changed
      if (currentSavedProgress !== currentWordIndex) {
        const newProgress = { ...savedProgress, [progressKey]: currentWordIndex }
        setSavedProgress(newProgress)
        localStorage.setItem("spellingProgress", JSON.stringify(newProgress))
      }
    }
  }, [currentWordIndex, currentList, activeTab, savedProgress])

  // Save favourites whenever they change
  useEffect(() => {
    localStorage.setItem("favouriteWords", JSON.stringify(Array.from(favouriteWords)))
  }, [favouriteWords])

  // Smart search functionality
  const filteredWords = useMemo(() => {
    if (!currentList || !searchQuery.trim()) {
      return currentList?.words || []
    }

    const query = searchQuery.toLowerCase().trim()
    return currentList.words.filter((word) => {
      const wordLower = word.word.toLowerCase()
      return (
        wordLower.includes(query) ||
        wordLower.startsWith(query) ||
        wordLower.endsWith(query) ||
        (word.context && word.context.toLowerCase().includes(query))
      )
    })
  }, [currentList, searchQuery])

  const toggleFavourite = (word: string) => {
    setFavouriteWords((prev) => {
      const newFavourites = new Set(prev)
      if (newFavourites.has(word)) {
        newFavourites.delete(word)
      } else {
        newFavourites.add(word)
      }
      return newFavourites
    })
  }

  const loadEmbeddedWords = async () => {
    setIsLoading(true)
    setIsFullScreenLoading(true)
    setIsLoadingComplete(false)

    try {
      // Simulate loading delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Convert embedded words array to WordList format
      const words: Word[] = EMBEDDED_WORDS.map((word) => ({
        word: word,
        spokenWord: word,
      }))

      const wordList: WordList = {
        name: "OET Ultimacy recalls",
        words: words,
      }

      setWordLists([wordList])
      console.log(`Successfully loaded ${words.length} embedded OET words`)

      setIsLoadingComplete(true)

      // Prepare the word list for selection but don't auto-select
      setTimeout(() => {
        selectList(wordList)
      }, 500)
    } catch (error) {
      console.error("Error loading embedded words:", error)
      alert("Error loading embedded words. Please try again.")
      setIsFullScreenLoading(false)
      setIsLoadingComplete(false)
    } finally {
      setIsLoading(false)
    }
  }

  const speak = useCallback((text: string) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = LANGUAGE_CODE
      utterance.rate = SPEECH_RATE
      utterance.volume = 1
      speechSynthesis.speak(utterance)
    }
  }, [])

  const playWord = useCallback(
    (word: Word) => {
      speechSynthesis.cancel()
      speak(word.spokenWord || word.word)
      if (word.context) {
        setTimeout(() => speak(word.context!), 1500)
        setTimeout(() => speak(word.spokenWord || word.word), 3000)
      }
    },
    [speak],
  )

  const selectList = (list: WordList) => {
    setCurrentList(list)
    setCurrentMode("list")
    setCurrentWordIndex(0)
    setUserInput("")
    setShowResult(false)
    setPracticeComplete(false)
    setQuizComplete(false)
    setActiveTab("list")
    setSearchQuery("")
  }

  const checkPracticeWord = () => {
    if (!userInput.trim() || !practiceWords[currentWordIndex]) return

    const currentWord = practiceWords[currentWordIndex]
    const correct = userInput.toLowerCase().trim() === currentWord.word.toLowerCase()

    setIsCorrect(correct)
    setShowResult(true)
    setPracticeAttempts((prev) => prev + 1)

    if (correct) {
      setPracticeScore((prev) => prev + 1)
      speak(PROMPTS.good)
      // Auto-advance after 1 second for correct answers
      setTimeout(() => {
        nextPracticeWord()
      }, 1000)
    } else {
      setPracticeWords((prev) => [...prev, currentWord])
      speak(PROMPTS.oops)
      setTimeout(() => speak(currentWord.spokenWord || currentWord.word), 1000)

      // Auto-focus on the "Next" button for wrong answers
      setTimeout(() => {
        const nextButton = document.querySelector('button[data-next-button="true"]') as HTMLButtonElement
        nextButton?.focus()
      }, 100)
    }
  }

  const navigateToPreviousWord = () => {
    if (currentWordIndex > 0) {
      const newIndex = currentWordIndex - 1
      setCurrentWordIndex(newIndex)
      setUserInput("")
      setShowResult(false)
      setCanNavigateBack(newIndex > 0)
      setCanNavigateForward(true)

      setTimeout(() => {
        const word = practiceWords[newIndex]
        speak(word.spokenWord || word.word)
        if (word.context) {
          setTimeout(() => speak(word.context!), 1000)
          setTimeout(() => speak(word.spokenWord || word.word), 2500)
        }
      }, 500)
    }
  }

  const navigateToNextWord = () => {
    if (currentWordIndex < practiceWords.length - 1) {
      const newIndex = currentWordIndex + 1
      setCurrentWordIndex(newIndex)
      setUserInput("")
      setShowResult(false)
      setCanNavigateBack(true)
      setCanNavigateForward(newIndex < practiceWords.length - 1)

      setTimeout(() => {
        const word = practiceWords[newIndex]
        speak(word.spokenWord || word.word)
        if (word.context) {
          setTimeout(() => speak(word.context!), 1000)
          setTimeout(() => speak(word.spokenWord || word.word), 2500)
        }
      }, 500)
    }
  }

  const nextPracticeWord = () => {
    if (currentWordIndex >= practiceWords.length - 1) {
      setPracticeComplete(true)
      speak(PROMPTS.greatJob)

      const progressKey = `${currentList?.name}_progress`
      const newProgress = { ...savedProgress }
      delete newProgress[progressKey]
      setSavedProgress(newProgress)
      localStorage.setItem("spellingProgress", JSON.stringify(newProgress))
    } else {
      const newIndex = currentWordIndex + 1
      setCurrentWordIndex(newIndex)
      setUserInput("")
      setShowResult(false)
      setCanNavigateBack(true)
      setCanNavigateForward(newIndex < practiceWords.length - 1)

      setTimeout(() => {
        const nextWord = practiceWords[newIndex]
        speak(nextWord.spokenWord || nextWord.word)
        if (nextWord.context) {
          setTimeout(() => speak(nextWord.context!), 1000)
          setTimeout(() => speak(nextWord.spokenWord || nextWord.word), 2500)
        }
        // Focus the input after speaking starts
        setTimeout(() => {
          inputRef.current?.focus()
        }, 100)
      }, 500)
    }
  }

  const repeatCurrentWord = () => {
    const words = activeTab === "practice" ? practiceWords : quizWords
    const currentWord = words[currentWordIndex]
    if (currentWord) {
      speak(currentWord.spokenWord || currentWord.word)
      if (currentWord.context) {
        setTimeout(() => speak(currentWord.context!), 1000)
        setTimeout(() => speak(currentWord.spokenWord || currentWord.word), 2500)
      }
    }
  }

  const resetToMenu = () => {
    speechSynthesis.cancel()
    setCurrentMode("menu")
    setCurrentList(null)
    setCurrentWordIndex(0)
    setUserInput("")
    setShowResult(false)
    setPracticeComplete(false)
    setQuizComplete(false)
    setSearchQuery("")
  }

  const handleLoadWords = useCallback(async () => {
    if (!isLoading) {
      await loadEmbeddedWords()
    }
  }, [isLoading])

  const handleContinueFromLoading = () => {
    setIsFullScreenLoading(false)
    setIsLoadingComplete(false)
  }

  // Initialize practice - always start from last progress
  const handlePracticeTab = useCallback(() => {
    if (activeTab !== "practice") {
      const progressKey = `${currentList?.name}_progress`
      const savedIndex = savedProgress[progressKey] || 0

      const words = [...(currentList?.words || [])]
      setPracticeWords(words)
      setCurrentWordIndex(savedIndex)
      setPracticeStartIndex(savedIndex)
      setPracticeScore(0)
      setPracticeAttempts(0)
      setPracticeComplete(false)
      setCanNavigateBack(savedIndex > 0)
      setCanNavigateForward(savedIndex < words.length - 1)
      setUserInput("")
      setShowResult(false)

      setTimeout(() => {
        if (words[savedIndex]) {
          speak(words[savedIndex].spokenWord || words[savedIndex].word)
          if (words[savedIndex].context) {
            setTimeout(() => speak(words[savedIndex].context!), 1000)
            setTimeout(() => speak(words[savedIndex].spokenWord || words[savedIndex].word), 2500)
          }
        }
      }, 500)
    }
    setActiveTab("practice")
  }, [activeTab, currentList, savedProgress, speak])

  // Start from specific word number
  const startFromWordNumber = (wordNumber: number) => {
    const words = [...(currentList?.words || [])]
    const startIndex = Math.max(0, Math.min(wordNumber - 1, words.length - 1))

    setPracticeWords(words)
    setCurrentWordIndex(startIndex)
    setPracticeStartIndex(startIndex)
    setPracticeScore(0)
    setPracticeAttempts(0)
    setPracticeComplete(false)
    setCanNavigateBack(startIndex > 0)
    setCanNavigateForward(startIndex < words.length - 1)
    setUserInput("")
    setShowResult(false)

    setTimeout(() => {
      if (words[startIndex]) {
        speak(words[startIndex].spokenWord || words[startIndex].word)
        if (words[startIndex].context) {
          setTimeout(() => speak(words[startIndex].context!), 1000)
          setTimeout(() => speak(words[startIndex].spokenWord || words[startIndex].word), 2500)
        }
      }
    }, 500)
  }

  // Initialize quiz with random 24 words
  const handleQuizTab = useCallback(() => {
    const allWords = [...(currentList?.words || [])]

    // Shuffle and pick 24 random words
    const shuffled = [...allWords].sort(() => Math.random() - 0.5)
    const selectedWords = shuffled.slice(0, Math.min(24, allWords.length))

    setQuizWords(selectedWords)
    setCurrentWordIndex(0)
    setQuizResults([])
    setQuizComplete(false)
    setQuizRepeatedWords(new Set())
    setUserInput("")

    setTimeout(() => {
      if (selectedWords[0]) {
        speak(selectedWords[0].spokenWord || selectedWords[0].word)
        if (selectedWords[0].context) {
          setTimeout(() => speak(selectedWords[0].context!), 1000)
          setTimeout(() => speak(selectedWords[0].spokenWord || selectedWords[0].word), 2500)
        }
      }
    }, 500)
    setActiveTab("quiz")
  }, [currentList, speak])

  // Get favourite words from all lists - fixed to prevent duplicates
  const getFavouriteWordsList = (): Word[] => {
    const allWords: Word[] = []
    const addedWords = new Set<string>()

    wordLists.forEach((list) => {
      list.words.forEach((word) => {
        if (favouriteWords.has(word.word) && !addedWords.has(word.word)) {
          allWords.push(word)
          addedWords.add(word.word)
        }
      })
    })
    return allWords
  }

  // Initialize favourites quiz with random 24 words from favourites
  const handleFavouritesQuiz = useCallback(() => {
    const favouritesList = getFavouriteWordsList()

    if (favouritesList.length === 0) {
      alert("No favourite words available for quiz!")
      return
    }

    // Shuffle and pick up to 24 random words from favourites
    const shuffled = [...favouritesList].sort(() => Math.random() - 0.5)
    const selectedWords = shuffled.slice(0, Math.min(24, favouritesList.length))

    setFavouritesQuizWords(selectedWords)
    setCurrentWordIndex(0)
    setFavouritesQuizResults([])
    setFavouritesQuizComplete(false)
    setFavouritesQuizRepeatedWords(new Set())
    setUserInput("")
    setIsInFavouritesQuiz(true)

    setTimeout(() => {
      if (selectedWords[0]) {
        speak(selectedWords[0].spokenWord || selectedWords[0].word)
        if (selectedWords[0].context) {
          setTimeout(() => speak(selectedWords[0].context!), 1000)
          setTimeout(() => speak(selectedWords[0].spokenWord || selectedWords[0].word), 2500)
        }
      }
    }, 500)
    setActiveTab("favourites")
  }, [speak, wordLists, favouriteWords])

  const submitQuizAnswer = () => {
    if (!userInput.trim() || !quizWords[currentWordIndex]) return

    const currentWord = quizWords[currentWordIndex]
    const correct = userInput.toLowerCase().trim() === currentWord.word.toLowerCase()

    setQuizResults((prev) => [
      ...prev,
      {
        word: currentWord.word,
        userAnswer: userInput.trim(),
        correct,
      },
    ])

    if (currentWordIndex >= quizWords.length - 1) {
      setQuizComplete(true)
    } else {
      setCurrentWordIndex((prev) => prev + 1)
      setUserInput("")

      setTimeout(() => {
        const nextWord = quizWords[currentWordIndex + 1]
        speak(nextWord.spokenWord || nextWord.word)
        if (nextWord.context) {
          setTimeout(() => speak(nextWord.context!), 1000)
          setTimeout(() => speak(nextWord.spokenWord || nextWord.word), 2500)
        }
        // Focus the input after speaking starts
        setTimeout(() => {
          const quizInput = document.querySelector(
            'input[placeholder="Type the word you heard..."]',
          ) as HTMLInputElement
          quizInput?.focus()
        }, 100)
      }, 500)
    }
  }

  const submitFavouritesQuizAnswer = () => {
    if (!userInput.trim() || !favouritesQuizWords[currentWordIndex]) return

    const currentWord = favouritesQuizWords[currentWordIndex]
    const correct = userInput.toLowerCase().trim() === currentWord.word.toLowerCase()

    setFavouritesQuizResults((prev) => [
      ...prev,
      {
        word: currentWord.word,
        userAnswer: userInput.trim(),
        correct,
      },
    ])

    if (currentWordIndex >= favouritesQuizWords.length - 1) {
      setFavouritesQuizComplete(true)
    } else {
      setCurrentWordIndex((prev) => prev + 1)
      setUserInput("")

      setTimeout(() => {
        const nextWord = favouritesQuizWords[currentWordIndex + 1]
        speak(nextWord.spokenWord || nextWord.word)
        if (nextWord.context) {
          setTimeout(() => speak(nextWord.context!), 1000)
          setTimeout(() => speak(nextWord.spokenWord || nextWord.word), 2500)
        }
        // Focus the input after speaking starts
        setTimeout(() => {
          const favInput = document.querySelector('input[placeholder="Type the word you heard..."]') as HTMLInputElement
          favInput?.focus()
        }, 100)
      }, 500)
    }
  }

  const repeatQuizWord = () => {
    const currentWord = quizWords[currentWordIndex]
    if (currentWord && !quizRepeatedWords.has(currentWordIndex)) {
      setQuizRepeatedWords((prev) => new Set([...prev, currentWordIndex]))
      speak(currentWord.spokenWord || currentWord.word)
      if (currentWord.context) {
        setTimeout(() => speak(currentWord.context!), 1000)
        setTimeout(() => speak(currentWord.spokenWord || currentWord.word), 2500)
      }
    }
  }

  const repeatFavouritesQuizWord = () => {
    const currentWord = favouritesQuizWords[currentWordIndex]
    if (currentWord && !favouritesQuizRepeatedWords.has(currentWordIndex)) {
      setFavouritesQuizRepeatedWords((prev) => new Set([...prev, currentWordIndex]))
      speak(currentWord.spokenWord || currentWord.word)
      if (currentWord.context) {
        setTimeout(() => speak(currentWord.context!), 1000)
        setTimeout(() => speak(currentWord.spokenWord || currentWord.word), 2500)
      }
    }
  }

  const scrollToLoadWords = () => {
    const element = document.getElementById("load-words")
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  if (isFullScreenLoading) {
    return (
      <LoadingComponent
        show={true}
        onContinue={handleContinueFromLoading}
        showSpinner={!isLoadingComplete}
        isLoadingComplete={isLoadingComplete}
      />
    )
  }

  // Menu View
  if (currentMode === "menu") {
    return (
      <div className="min-h-screen">
        <Navigation />

        {/* Title Section - Above the image */}
        <section id="title" className="mx-auto max-w-5xl px-4 pt-8 pb-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">OET Listening Practice</h1>
          <p className="mt-3 text-lg md:text-2xl text-gray-700">
            Master your OET listening skills with Dr Ahmed Elgendy
          </p>
        </section>

        {/* Black Scroll Cue - Directly under title with pumping animation */}
        <div
          id="scroll-cue"
          aria-hidden="true"
          className="mx-auto mt-4 mb-2 flex flex-col items-center text-neutral-900 pointer-events-none"
        >
          <div className="rounded-full border-4 border-black p-2 animate-bounce-gentle">
            <svg
              viewBox="0 0 24 24"
              className="h-16 w-16 md:h-20 md:w-20 text-black"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
          <span className="mt-2 text-base md:text-lg font-semibold">Scroll down to start practising</span>
        </div>

        {/* Hero Section with Advertisement Image */}
        <section id="hero" className="relative text-right mx-0 w-full">
          <Image
            src="/oet-listening-ad-long.jpg"
            alt="OET Ultimacy advertisement"
            width={1600}
            height={3200}
            priority
            className="w-full h-auto object-contain select-none"
          />
        </section>

        {/* CTA Section */}
        <section id="cta" className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Ready to Start Practising?</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Access our comprehensive OET listening practice materials and start improving your skills today.
            </p>

            <button
              id="load-words"
              onClick={handleLoadWords}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-6 px-12 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-xl animate-pump focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/50"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </div>
              ) : (
                "Load OET Words"
              )}
            </button>

            {/* Additional Info */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">Need help or have questions?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="https://t.me/elgendy011"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  📱 Contact Dr Ahmed Elgendy
                </a>
                <span className="hidden sm:inline text-gray-300">|</span>
                <a
                  href="https://t.me/OETultimacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  📢 Join OET Ultimacy Telegram Channel
                </a>
                <span className="hidden sm:inline text-gray-300">|</span>
                <a
                  href="https://www.youtube.com/@OETUltimacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  🎥 Join YouTube Channel
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // List View with Tabs
  if (currentMode === "list" && currentList) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <Navigation />

        {/* Add PromotionWidget to all sections with activeTab as trigger */}
        <PromotionWidget trigger={activeTab} />

        <div className="p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="outline" onClick={resetToMenu}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Menu
              </Button>
              <h1 className="text-2xl font-bold text-purple-700">{currentList.name}</h1>
              <span className="text-sm text-gray-600">({currentList.words.length} words)</span>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6">
              <div className="flex justify-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("list")}
                  className={`px-4 py-2 rounded-md font-medium transition-colors text-sm ${
                    activeTab === "list" ? "bg-green-500 text-white" : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  📋 List
                </button>
                <button
                  onClick={handlePracticeTab}
                  className={`px-4 py-2 rounded-md font-medium transition-colors text-sm ${
                    activeTab === "practice" ? "bg-blue-500 text-white" : "text-blue-600 hover:text-blue-800"
                  }`}
                >
                  🧠 Practice
                </button>
                <button
                  onClick={handleQuizTab}
                  className={`px-4 py-2 rounded-md font-medium transition-colors text-sm ${
                    activeTab === "quiz" ? "bg-pink-500 text-white" : "text-pink-600 hover:text-pink-800"
                  }`}
                >
                  🏆 Quiz
                </button>
                <button
                  onClick={() => setActiveTab("favourites")}
                  className={`px-4 py-2 rounded-md font-medium transition-colors text-sm ${
                    activeTab === "favourites" ? "bg-yellow-500 text-white" : "text-yellow-600 hover:text-yellow-800"
                  }`}
                >
                  ⭐ Favourites
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "list" && (
              <Card>
                {/* Search Bar - Fixed at top */}
                <div className="sticky top-16 z-30 bg-white border-b p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search words... (start, end, or contains)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4"
                    />
                  </div>
                  {searchQuery && (
                    <p className="text-sm text-gray-600 mt-2">
                      Found {filteredWords.length} result{filteredWords.length !== 1 ? "s" : ""} for "{searchQuery}"
                    </p>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="space-y-3">
                    {filteredWords.map((word) => {
                      // Where THIS instance sits in the full list (its real sequence position)
                      const sequenceIndex = currentList.words.indexOf(word) + 1

                      // Where the word FIRST appeared (for duplicates)
                      const firstIndex = currentList.words.findIndex((w) => w.word === word.word) + 1

                      return (
                        <div key={sequenceIndex} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => playWord(word)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Play className="w-4 h-4" />
                          </Button>

                          <div className="flex-1">
                            <span className="font-medium text-lg">{word.word}</span>
                            {word.context && <p className="text-sm text-gray-600 mt-1">{word.context}</p>}
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavourite(word.word)}
                            className={`p-1 ${
                              favouriteWords.has(word.word) ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"
                            }`}
                          >
                            <Star className="w-4 h-4" fill={favouriteWords.has(word.word) ? "currentColor" : "none"} />
                          </Button>

                          <span className="text-sm text-gray-500">
                            #{sequenceIndex}
                            {firstIndex !== sequenceIndex && (
                              <span className="ml-1 text-gray-400">(first #{firstIndex})</span>
                            )}
                          </span>
                        </div>
                      )
                    })}

                    {filteredWords.length === 0 && searchQuery && (
                      <div className="text-center py-8">
                        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg mb-2">No words found</p>
                        <p className="text-gray-400 text-sm">
                          Try searching with different keywords or check your spelling
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "practice" && (
              <div>
                {practiceComplete ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold mb-4">Practice Complete!</h2>
                      <p className="text-lg mb-6">
                        Final Score: {practiceScore}/{practiceAttempts} (
                        {Math.round((practiceScore / practiceAttempts) * 100)}%)
                      </p>
                      <div className="flex gap-4 justify-center">
                        <Button onClick={handlePracticeTab} className="bg-blue-600 hover:bg-blue-700">
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Practice Again
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div>
                    {/* Practice Controls - Made smaller and moved up */}
                    <Card className="mb-4">
                      <CardContent className="p-3">
                        <div className="flex flex-wrap gap-2 items-center justify-center">
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="Word #"
                              value={startFromWordInput}
                              onChange={(e) => setStartFromWordInput(e.target.value)}
                              className="w-16 h-8 text-sm"
                              min="1"
                              max={currentList.words.length}
                            />
                            <Button
                              onClick={() => {
                                const wordNum = Number.parseInt(startFromWordInput)
                                if (wordNum >= 1 && wordNum <= currentList.words.length) {
                                  startFromWordNumber(wordNum)
                                  setStartFromWordInput("")
                                }
                              }}
                              disabled={
                                !startFromWordInput ||
                                Number.parseInt(startFromWordInput) < 1 ||
                                Number.parseInt(startFromWordInput) > currentList.words.length
                              }
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              Start from #{startFromWordInput}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">
                          Word {currentWordIndex + 1} of {practiceWords.length} | Score: {practiceScore}/
                          {practiceAttempts}
                        </p>
                        {savedProgress[`${currentList.name}_progress`] > 0 && (
                          <p className="text-xs text-blue-600">
                            Progress saved • Started from word {practiceStartIndex + 1}
                          </p>
                        )}
                      </div>
                      <Progress
                        value={practiceWords.length > 0 ? ((currentWordIndex + 1) / practiceWords.length) * 100 : 0}
                      />
                    </div>

                    <Card>
                      <CardContent className="p-6 text-center">
                        {showResult && (
                          <div className="mb-6">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <p className="text-lg font-medium">{practiceWords[currentWordIndex]?.word}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFavourite(practiceWords[currentWordIndex]?.word)}
                                className={`p-1 ${
                                  favouriteWords.has(practiceWords[currentWordIndex]?.word)
                                    ? "text-yellow-500"
                                    : "text-gray-400 hover:text-yellow-500"
                                }`}
                              >
                                <Star
                                  className="w-5 h-5"
                                  fill={
                                    favouriteWords.has(practiceWords[currentWordIndex]?.word) ? "currentColor" : "none"
                                  }
                                />
                              </Button>
                              {/* Next Word button next to star for both correct and wrong answers */}
                              <Button onClick={nextPracticeWord} size="sm" className="ml-2" data-next-button="true">
                                <ArrowRight className="w-4 h-4 mr-1" />
                                Next
                              </Button>
                            </div>

                            {/* Show user answer and correct answer side by side */}
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-center gap-4 text-sm">
                                <div className="text-center">
                                  <p className="text-gray-600 mb-1">Your answer:</p>
                                  <p className={`font-medium ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                                    {userInput}
                                  </p>
                                </div>
                                {!isCorrect && (
                                  <>
                                    <div className="text-gray-400">→</div>
                                    <div className="text-center">
                                      <p className="text-gray-600 mb-1">Correct answer:</p>
                                      <p className="font-medium text-green-700">
                                        {practiceWords[currentWordIndex]?.word}
                                      </p>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className={`p-4 rounded-lg ${isCorrect ? "bg-green-50" : "bg-red-50"}`}>
                              <div className="flex items-center justify-center gap-2">
                                {isCorrect ? (
                                  <CheckCircle className="w-6 h-6 text-green-600" />
                                ) : (
                                  <XCircle className="w-6 h-6 text-red-600" />
                                )}
                                <span className={`font-semibold ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                                  {isCorrect ? "Correct!" : "Try again - word added to end"}
                                </span>
                              </div>
                            </div>

                            {/* Navigation buttons for manual navigation */}
                            <div className="flex gap-2 justify-center mt-4">
                              <Button
                                variant="outline"
                                onClick={navigateToPreviousWord}
                                disabled={!canNavigateBack}
                                size="sm"
                              >
                                <ArrowLeft className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                onClick={navigateToNextWord}
                                disabled={!canNavigateForward}
                                size="sm"
                              >
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="space-y-4">
                          <Input
                            ref={inputRef}
                            type="text"
                            placeholder="Type the word you heard..."
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                if (showResult) {
                                  // If showing result and Next button is focused, move to next word
                                  const nextButton = document.querySelector(
                                    'button[data-next-button="true"]',
                                  ) as HTMLButtonElement
                                  if (document.activeElement === nextButton) {
                                    nextPracticeWord()
                                  } else {
                                    nextPracticeWord()
                                  }
                                } else {
                                  checkPracticeWord()
                                }
                              }
                            }}
                            className="text-center text-lg"
                            disabled={showResult}
                          />

                          <div className="flex gap-2 justify-center">
                            {!showResult ? (
                              <>
                                <Button
                                  variant="outline"
                                  onClick={navigateToPreviousWord}
                                  disabled={!canNavigateBack}
                                  size="sm"
                                >
                                  <ArrowLeft className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" onClick={repeatCurrentWord}>
                                  <Repeat className="w-4 h-4 mr-2" />
                                  Repeat
                                </Button>
                                <Button onClick={checkPracticeWord} disabled={!userInput.trim()}>
                                  <Check className="w-4 h-4 mr-2" />
                                  Check
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={navigateToNextWord}
                                  disabled={!canNavigateForward}
                                  size="sm"
                                >
                                  <ArrowRight className="w-4 h-4" />
                                </Button>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {activeTab === "quiz" && (
              <div>
                {quizComplete ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center flex items-center justify-center gap-2">
                        <Trophy className="w-6 h-6" />
                        Quiz Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-2">{quizResults.filter((r) => r.correct).length}/24</div>
                        <div className="text-xl text-gray-600">
                          {Math.round((quizResults.filter((r) => r.correct).length / 24) * 100)}% Correct
                        </div>
                        <div className="text-lg text-gray-500 mt-2">
                          Grade: {Math.round((quizResults.filter((r) => r.correct).length / 24) * 100)}/100
                        </div>
                      </div>

                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {quizResults.map((result, index) => (
                          <div
                            key={index}
                            className={`flex items-center gap-3 p-3 rounded-lg ${result.correct ? "bg-green-50" : "bg-red-50"}`}
                          >
                            {result.correct ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                            <div className="flex-1">
                              <div className="font-medium">{result.word}</div>
                              <div className="text-sm text-gray-600">Your answer: {result.userAnswer}</div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFavourite(result.word)}
                              className={`p-1 ${
                                favouriteWords.has(result.word)
                                  ? "text-yellow-500"
                                  : "text-gray-400 hover:text-yellow-500"
                              }`}
                            >
                              <Star
                                className="w-4 h-4"
                                fill={favouriteWords.has(result.word) ? "currentColor" : "none"}
                              />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-4 justify-center">
                        <Button onClick={handleQuizTab} className="bg-pink-600 hover:bg-pink-700">
                          <RotateCcw className="w-4 h-4 mr-2" />
                          New Quiz
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div>
                    <div className="mb-6">
                      <p className="text-sm text-gray-600 mb-2">Question {currentWordIndex + 1} of 24 | Random Quiz</p>
                      <Progress value={((currentWordIndex + 1) / 24) * 100} />
                    </div>

                    <Card>
                      <CardContent className="p-8 text-center">
                        <div className="space-y-4">
                          <Input
                            type="text"
                            placeholder="Type the word you heard..."
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && submitQuizAnswer()}
                            className="text-center text-lg"
                          />

                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="outline"
                              onClick={repeatQuizWord}
                              disabled={quizRepeatedWords.has(currentWordIndex)}
                            >
                              <Repeat className="w-4 h-4 mr-2" />
                              {quizRepeatedWords.has(currentWordIndex) ? "Already Repeated" : "Repeat (1x only)"}
                            </Button>
                            <Button onClick={submitQuizAnswer} disabled={!userInput.trim()}>
                              <ArrowRight className="w-4 h-4 mr-2" />
                              {currentWordIndex >= 23 ? "Submit" : "Next"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {activeTab === "favourites" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Favourite Words
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {!isInFavouritesQuiz ? (
                    <>
                      {getFavouriteWordsList().length === 0 ? (
                        <div className="text-center py-8">
                          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg mb-2">No favourite words yet</p>
                          <p className="text-gray-400 text-sm">
                            Add words to favourites by clicking the star icon during practice or in quiz results
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-center mb-4">
                            <p className="text-sm text-gray-600">{getFavouriteWordsList().length} favourite words</p>
                            <Button
                              onClick={handleFavouritesQuiz}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white"
                              disabled={getFavouriteWordsList().length === 0}
                            >
                              🏆 Quiz on Favourites
                            </Button>
                          </div>
                          <div className="space-y-3">
                            {getFavouriteWordsList().map((word, index) => (
                              <div
                                key={`${word.word}-${index}`}
                                className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm"
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => playWord(word)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <Play className="w-4 h-4" />
                                </Button>
                                <div className="flex-1">
                                  <span className="font-medium text-lg">{word.word}</span>
                                  {word.context && <p className="text-sm text-gray-600 mt-1">{word.context}</p>}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleFavourite(word.word)}
                                  className="text-yellow-500 hover:text-yellow-600"
                                >
                                  <Star className="w-5 h-5" fill="currentColor" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    // Favourites Quiz Content
                    <div>
                      {favouritesQuizComplete ? (
                        <div>
                          <div className="text-center mb-6">
                            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold mb-2">Favourites Quiz Results</h2>
                            <div className="text-3xl font-bold mb-2">
                              {favouritesQuizResults.filter((r) => r.correct).length}/{favouritesQuizWords.length}
                            </div>
                            <div className="text-xl text-gray-600">
                              {Math.round(
                                (favouritesQuizResults.filter((r) => r.correct).length / favouritesQuizWords.length) *
                                  100,
                              )}
                              % Correct
                            </div>
                            <div className="text-lg text-gray-500 mt-2">
                              Grade:{" "}
                              {Math.round(
                                (favouritesQuizResults.filter((r) => r.correct).length / favouritesQuizWords.length) *
                                  100,
                              )}
                              /100
                            </div>
                          </div>

                          <div className="space-y-2 max-h-96 overflow-y-auto mb-6">
                            {favouritesQuizResults.map((result, index) => (
                              <div
                                key={index}
                                className={`flex items-center gap-3 p-3 rounded-lg ${result.correct ? "bg-green-50" : "bg-red-50"}`}
                              >
                                {result.correct ? (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-red-600" />
                                )}
                                <div className="flex-1">
                                  <div className="font-medium">{result.word}</div>
                                  <div className="text-sm text-gray-600">Your answer: {result.userAnswer}</div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleFavourite(result.word)}
                                  className={`p-1 ${
                                    favouriteWords.has(result.word)
                                      ? "text-yellow-500"
                                      : "text-gray-400 hover:text-yellow-500"
                                  }`}
                                >
                                  <Star
                                    className="w-4 h-4"
                                    fill={favouriteWords.has(result.word) ? "currentColor" : "none"}
                                  />
                                </Button>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-4 justify-center">
                            <Button onClick={handleFavouritesQuiz} className="bg-yellow-500 hover:bg-yellow-600">
                              <RotateCcw className="w-4 h-4 mr-2" />
                              New Favourites Quiz
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsInFavouritesQuiz(false)
                                setFavouritesQuizComplete(false)
                                setCurrentWordIndex(0)
                                setUserInput("")
                              }}
                            >
                              Back to Favourites List
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {/* Add Back to Favourites List button */}
                          <div className="flex justify-between items-center mb-4">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsInFavouritesQuiz(false)
                                setFavouritesQuizComplete(false)
                                setCurrentWordIndex(0)
                                setUserInput("")
                              }}
                              size="sm"
                            >
                              <ArrowLeft className="w-4 h-4 mr-2" />
                              Back to Favourites List
                            </Button>
                            <h3 className="text-lg font-semibold">Favourites Quiz</h3>
                          </div>

                          <div className="mb-6">
                            <p className="text-sm text-gray-600 mb-2">
                              Question {currentWordIndex + 1} of {favouritesQuizWords.length} | Favourites Quiz
                            </p>
                            <Progress value={((currentWordIndex + 1) / favouritesQuizWords.length) * 100} />
                          </div>

                          <div className="p-8 text-center bg-white rounded-lg">
                            <div className="space-y-4">
                              <Input
                                type="text"
                                placeholder="Type the word you heard..."
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && submitFavouritesQuizAnswer()}
                                className="text-center text-lg"
                              />

                              <div className="flex gap-2 justify-center">
                                <Button
                                  variant="outline"
                                  onClick={repeatFavouritesQuizWord}
                                  disabled={favouritesQuizRepeatedWords.has(currentWordIndex)}
                                >
                                  <Repeat className="w-4 h-4 mr-2" />
                                  {favouritesQuizRepeatedWords.has(currentWordIndex)
                                    ? "Already Repeated"
                                    : "Repeat (1x only)"}
                                </Button>
                                <Button onClick={submitFavouritesQuizAnswer} disabled={!userInput.trim()}>
                                  <ArrowRight className="w-4 h-4 mr-2" />
                                  {currentWordIndex >= favouritesQuizWords.length - 1 ? "Submit" : "Next"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}
