import mongoose from "mongoose";
const { Schema } = mongoose;

const patientSchema = new Schema({
  name: {
    type: {
      first: { type: String, required: true },
      middle: { type: String },
      last: { type: String, required: true }
    },
    required: true
  },
  
  date_of_birth: {
    type: String,
    required: true,
    match: /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])-\d{4}$/
  },
  
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  
  blood_group: {
    type: String,
    required: true,
    enum: [
      'A Positive (A⁺)', 'A Negative (A⁻)',
      'B Positive (B⁺)', 'B Negative (B⁻)',
      'AB Positive (AB⁺)', 'AB Negative (AB⁻)',
      'O Positive (O⁺)', 'O Negative (O⁻)',
      'None'
    ]
  },
  
  address: {
    type: {
      street: { type: String },
      city: { type: String, required: true },
      postal_code: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true }
    },
    required: true
  },
  
  occupation: {
    type: String,
    enum: [
      'Unemployed', 'Employed', 'Student', 'Business',
      'Services', 'Retired', 'Government /civil service', 'Other'
    ]
  },
  
  aadhaar: {
    type: String,
    match: /^[0-9]{12}$/
  },
  
  pan: {
    type: String,
    match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
  },
  
  img: {
    file_id: { type: Schema.Types.ObjectId }
  },
  
  contact_info: {
    type: {
      mobile: {
        type: {
          code: {
            type: String,
            required: true,
            match: /^\+\d{1,3}$/
          },
          number: {
            type: String,
            required: true,
            match: /^\d{7,10}$/
          }
        },
        required: true
      },
      home_phone: {
        code: {
          type: String,
          match: /^\+\d{1,3}$/
        },
        number: {
          type: String,
          match: /^\d{7,10}$/
        }
      },
      work_phone: {
        code: {
          type: String,
          match: /^\+\d{1,3}$/
        },
        number: {
          type: String,
          match: /^\d{7,10}$/
        }
      },
      email: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      },
      preferred_contact_methods: {
        type: [{
          type: String,
          enum: ['Phone Call', 'Messages', 'Email']
        }],
        required: true
      },
      emergency_contact: {
        type: [{
          name: {
            type: {
              first: { type: String, required: true },
              middle: { type: String },
              last: { type: String, required: true }
            },
            required: true
          },
          relationship: { type: String, required: true },
          phone: {
            type: {
              code: {
                type: String,
                required: true,
                match: /^\+\d{1,3}$/
              },
              number: {
                type: String,
                required: true,
                match: /^\d{7,10}$/
              }
            },
            required: true
          },
          email: {
            type: String,
            required: true,
            match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          }
        }],
        required: true
      }
    },
    required: true
  },
  
  insurance: {
    type: {
      primary: {
        type: {
          company_name: { type: String, required: true },
          policy_number: { type: String, required: true },
          group_number: { type: String },
          plan_type: {
            type: String,
            required: true,
            enum: [
              'Health Maintenance Organization (HMO)',
              'Preferred Provider Organization (PPO)',
              'Point of Service (POS)',
              'Exclusive Provider Organization (EPO)',
              'Medicare', 'Medicaid', 'Private Insurance', 'Other'
            ]
          },
          effective_start: {
            type: String,
            match: /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])-\d{4}$/
          },
          effective_end: {
            type: String,
            match: /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])-\d{4}$/
          }
        },
        required: true
      },
      secondary: {
        company_name: { type: String },
        policy_number: { type: String },
        group_number: { type: String },
        plan_type: {
          type: String,
          enum: [
            'Health Maintenance Organization (HMO)',
            'Preferred Provider Organization (PPO)',
            'Point of Service (POS)',
            'Exclusive Provider Organization (EPO)',
            'Medicare', 'Medicaid', 'Private Insurance', 'Other'
          ]
        },
        effective_start: {
          type: String,
          match: /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])-\d{4}$/
        },
        effective_end: {
          type: String,
          match: /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])-\d{4}$/
        }
      },
      insurance_contact_number: {
        type: String,
        required: true,
        match: /^\d{7,10}$/
      },
      insurance_card_img: {
        file_id: { type: Schema.Types.ObjectId }
      }
    },
    required: true
  },
  
  ailments: [{
    name: { type: String, required: true },
    icd_code: { type: String },
    description: { type: String },
    status: {
      type: String,
      required: true,
      enum: ['Active', 'Inactive', 'Resolved', 'Chronic', 'Acute', 'Recurrent', 'Unknown', 'None']
    },
    severity: {
      type: String,
      required: true,
      enum: ['Mild', 'Moderate', 'Severe', 'Critical', 'Unknown', 'None']
    },
    pain: {
      type: String,
      enum: [
        'No pain', 'Very mild', 'Mild', 'Moderate', 'Moderately severe',
        'Severe', 'Very severe', 'Intense', 'Very intense', 'Excruciating', 'Unimaginable'
      ]
    },
    date_of_onset: {
      type: String,
      match: /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])-\d{4}$/
    },
    risk_factor: { type: String },
    Comorbidities: { type: String },
    Medication_side_effects: { type: String },
    Treatment_plan: { type: String },
    Test_results: { type: String }
  }],

  medical_history: {
    conditions: [{
      condition_name: { type: String, required: true },
      diagnosis_date: {
        type: String,
        match: /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])-\d{4}$/
      },
      treating_physician: { type: String },
      status: {
        type: String,
        required: true,
        enum: ['Active', 'Inactive', 'Resolved', 'Chronic', 'Acute', 'Recurrent', 'Unknown', 'None']
      },
      severity: {
        type: String,
        required: true,
        enum: ['Mild', 'Moderate', 'Severe', 'Critical', 'unknown', 'None']
      }
    }],
    
    surgeries: [{
      surgery_type: {
        type: String,
        required: true,
        enum: [
          'Cardiothoracic Surgery', 'Orthopedic Surgery', 'Neurosurgery',
          'General Surgery', 'Plastic and Reconstructive Surgery', 'Pediatric Surgery',
          'Vascular Surgery', 'Urological Surgery', 'Gynecological Surgery',
          'ENT (Ear, Nose, Throat) Surgery', 'Ophthalmic Surgery (Eye Surgery)',
          'Oral and Maxillofacial Surgery', 'Transplant Surgery',
          'Bariatric Surgery (Weight Loss Surgery)', 'Cosmetic Surgery',
          'Oncological Surgery (Cancer Surgery)', 'Endoscopic Surgery',
          'Minimally Invasive Surgery', 'Trauma Surgery', 'Emergency Surgery',
          'Colorectal Surgery', 'Hernia Repair Surgery', 'Thoracic Surgery (Chest Surgery)',
          'Laparoscopic Surgery', 'Spinal Surgery', 'Other'
        ]
      },
      date: {
        type: String,
        match: /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/
      },
      surgeon_name: { type: String },
      post_operative_notes: { type: String }
    }],
    
    allergies: [{
      allergy_type: {
        type: String,
        required: true,
        enum: [
          'Medication Allergy', 'Food Allergy', 'Environmental Allergy',
          'Insect Sting Allergy', 'Latex Allergy', 'Animal Allergy',
          'Pollen Allergy', 'Mold Allergy', 'Dust Allergy', 'Other'
        ]
      },
      allergic_substance: {
        type: String,
        required: true,
        enum: [
          'Penicillin', 'Sulfa Drugs', 'Aspirin', 'Shellfish', 'Nuts',
          'Eggs', 'Milk', 'Wheat', 'Soy', 'Pollen', 'Dust Mites',
          'Latex', 'Nickel', 'Pet Dander', 'Bee Venom', 'Mold',
          'Certain Medications', 'Other'
        ]
      },
      severity: {
        type: String,
        required: true,
        enum: ['Mild', 'Moderate', 'Severe', 'Critical', 'Unknown']
      }
    }],
    
    immunizations: [{
      vaccine_name: {
        type: String,
        required: true,
        enum: [
          'Influenza (Flu) Vaccine', 'Measles, Mumps, and Rubella (MMR) Vaccine',
          'Varicella (Chickenpox) Vaccine', 'Hepatitis B Vaccine', 'Hepatitis A Vaccine',
          'Human Papillomavirus (HPV) Vaccine', 'Tetanus, Diphtheria, and Pertussis (Tdap) Vaccine',
          'Pneumococcal Vaccine', 'Meningococcal Vaccine', 'Haemophilus influenzae type b (Hib) Vaccine',
          'Rotavirus Vaccine', 'Polio Vaccine', 'Shingles (Herpes Zoster) Vaccine',
          'COVID-19 Vaccine', 'Typhoid Vaccine', 'Rabies Vaccine', 'Yellow Fever Vaccine',
          'Japanese Encephalitis Vaccine', 'Cholera Vaccine', 'Anthrax Vaccine'
        ]
      },
      date_administered: {
        type: String,
        match: /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/
      },
      adverse_reaction: { type: String }
    }],
    
    lab_reports: [{
      file_id: { type: Schema.Types.ObjectId, required: true },
      comments: { type: String }
    }],
    
    diagnostic_reports: [{
      file_id: { type: Schema.Types.ObjectId, required: true },
      comments: { type: String }
    }]
  },
  
  medication_history: [{
    problem: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100
    },
    medicine: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100
    },
    dosage: {
      type: Number,
      required: true,
      min: 0
    },
    dose_time: {
      type: String,
      required: true,
      enum: [
        "Morning", "Afternoon", "Evening",
        "Night", "Before Meals", "After Meals", "With Meals"
      ]
    },
    frequency: {
      type: String,
      required: true,
      enum: [
        "Once daily (OD)", "Twice daily (BD)", "Thrice daily (TDS)",
        "Four times daily (QID)", "As needed (PRN)", "Weekly", "Monthly"
      ]
    },
    duration: {
      type: String,
      required: true,
      enum: [
        "1 week", "2 weeks", "1 month",
        "3 months", "6 months", "1 year", "Ongoing"
      ]
    },
    status: {
      type: String,
      required: true,
      enum: ["Active", "Inactive"]
    }
  }],
  
  vitals: {
    date: {
      type: String,
      required: true,
      match: /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/
    },
    time: {
      type: String,
      required: true,
      match: /^(?:[01]\d|2[0-3]):[0-5]\d$/
    },
    blood_pressure: {
      systolic: { type: Number },
      diastolic: { type: Number }
    },
    pulse_rate: {
      value: { type: Number }
    },
    respiratory_rate: {
      value: { type: Number }
    },
    temperature: {
      value: { type: Number },
      unit: {
        type: String,
        enum: ['Fahrenheit', 'Celsius']
      }
    },
    spo2: {
      value: { type: Number }
    },
    height: {
      value: { type: Number },
      unit: {
        type: String,
        enum: ['feet', 'inches']
      }
    },
    weight: {
      value: { type: Number }
    },
    bmi: {
      value: { type: Number }
    },
    additional_comments: { type: String }
  },
  
  allergies: [{
    allergen: {
      type: String,
      enum: [
        'Penicillin', 'Sulfa Drugs', 'Aspirin', 'Shellfish',
        'Nuts (peanuts, almonds, cashews)', 'Eggs', 'Milk', 'Wheat', 'Soy',
        'Pollen (ragweed, grass)', 'Dust Mites', 'Latex', 'Nickel',
        'Pet Dander', 'Bee Venom', 'Mould', 'Certain Medications', 'Other'
      ]
    },
    reaction: {
      type: String,
      enum: [
        'Rash', 'Itching', 'Hives', 'Swelling', 'Difficulty Breathing',
        'Anaphylaxis', 'Nausea', 'Vomiting', 'Diarrhoea', 'Dizziness',
        'Fainting', 'Sneezing', 'Other'
      ]
    },
    severity: {
      type: String,
      enum: ['Mild', 'Moderate', 'Severe', 'Critical', 'Unknown', 'None']
    },
    category: {
      type: String,
      enum: ['Medications', 'Foods', 'Environmental', 'Insects', 'Latex', 'Other']
    },
    code: {
      type: String,
      enum: ['A100', 'A200', 'A300', 'A400', 'A500', 'A600']
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Resolved', 'Chronic', 'Acute', 'Recurrent', 'Unknown', 'None']
    }
  }],
  
family_history: {
    family_members: [{
      name: {
        first: { type: String, required: true },
        middle: { type: String },
        last: { type: String, required: true }
      },
      date_of_birth: {
        type: String,
        required: true,
        match: /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])-\d{4}$/
      },
      gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
      },
      relationship: {
        type: String,
        required: true,
        enum: [
          'Father', 'Mother', 'Brother', 'Sister', 'Son', 'Daughter',
          'Grandfather', 'Grandmother', 'Uncle', 'Aunt', 'Cousin',
          'Nephew', 'Niece', 'Spouse', 'Other'
        ]
      },
      deceased: { type: Boolean, required: true },
      medical_conditions: [{ type: String }],
      genetic_conditions: [{
        condition_name: { type: String, required: true },
        affected_family_member: {
          type: String,
          enum: [
            'Paternal Grandfather', 'Paternal Grandmother', 'Maternal Grandfather',
            'Maternal Grandmother', 'Paternal Uncle', 'Paternal Aunt',
            'Maternal Uncle', 'Maternal Aunt', 'Father', 'Mother',
            'Brother', 'Sister', 'Self', 'Other'
          ], 
          required: true
        },
        genetic_testing_results: {
          type: String,
          required: true,
          enum: ['Positive', 'Negative', 'Pending', 'Unknown', 'Not Tested']
        }
      }]
    }]
  },
  
  social_history: {
    tobacco_smoking: {
      current_status: {
        type: String,
        enum: ['Current Smoker', 'Former Smoker', 'Never Smoked']
      },
      average_daily_consumption: { type: Number },
      duration_of_use: { type: String },
      duration_unit: {
        type: String,
        enum: ['days', 'weeks', 'months', 'years']
      },
      quit_date: {
        type: String,
        match: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
      },
      notes: { type: String }
    },
    
    tobacco_consumption: {
      current_status: {
        type: String,
        enum: ['Never used', 'Current user', 'Former user', 'Social user']
      },
      average_daily_consumption: { type: Number },
      duration_of_use: { type: String },
      duration_unit: {
        type: String,
        enum: ['days', 'weeks', 'months', 'years']
      },
      quit_date: {
        type: String,
        match: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
      },
      notes: { type: String }
    },
    
    alcohol_use: {
      current_status: {
        type: String,
        enum: ['Non-Drinker', 'Moderate Drinker', 'Heavy Drinker']
      },
      average_weekly_consumption: { type: String },
      type_of_alcohol: {
        type: String,
        enum: [
          'Beer', 'Wine', 'Red wine', 'Wiskey', 'Vodka', 'Rum',
          'Gin', 'Tequila', 'Brandy', 'Mixed Drinks', 'Other'
        ]
      },
      period_of_use: { type: String },
      notes: { type: String }
    },
    
    social_history_free_text: {
      notes: { type: String }
    },
    
    financial_resources: {
      income_level: {
        type: String,
        enum: ['High', 'Moderate', 'Low']
      },
      employment_status: {
        type: String,
        enum: [
          'Employed Full-time', 'Employed Part-time', 'Employed',
          'Unemployed', 'Self-employed', 'Student', 'Retired',
          'Homemaker', 'Disabled', 'Other'
        ]
      },
      financial_support: {
        type: String,
        enum: [
          'None', 'Family', 'Government', 'Disability Benefits',
          'Retirement Benefits', 'Child Support', 'Alimony', 'Other'
        ]
      },
      notes: { type: String }
    },
    
    education: {
      highest_level_of_education: {
        type: String,
        enum: [
          'Uneducated', 'Below 10th', '10th Passed', '12th Passed',
          'BMS', 'High School', 'Diploma', "Bachelor's", "Master's",
          'PhD', 'Other'
        ]
      },
      notes: { type: String }
    },
    
    physical_activity: {
      frequency: { type: String },
      type_of_exercise: { type: String },
      duration: { type: Number },
      duration_unit: {
        type: String,
        enum: ['min', 'seconds', 'hr']
      },
      consistency: {
        type: String,
        enum: ['Regular', 'Occational', 'Irregular', 'Never']
      },
      notes: { type: String }
    },
    
    stress: {
      perceived_stress_level: {
        type: String,
        enum: ['None', 'Low', 'Moderate', 'High', 'Very High']
      },
      major_stressors: { type: String },
      coping_mechanisms: { type: String },
      notes: { type: String }
    },
    
    social_isolation_connection: {
      isolation_status: {
        type: String,
        enum: [
          'Not Isolated', 'Self-Isolating', 'Quarantined',
          'Socially Isolated', 'Other', 'Low', 'Moderate', 'High'
        ]
      },
      social_support: {
        type: String,
        enum: [
          'Strong', 'Moderate', 'Limited', 'None', 'Unknown',
          'Supportive family', 'Friends', 'Community groups',
          'Minimal Support', 'Other'
        ]
      },
      frequency_of_social_interactions: { type: String },
      notes: { type: String }
    },
    
    exposure_to_violence: {
      type_of_violence: {
        type: String,
        enum: [
          '', 'Physical', 'Sexual violence', 'Emotional abuse',
          'Financial', 'Domestic violence', 'Child Abuse', 'Elder Abuse',
          'Bullying', 'Workplace violence', 'Community violence', 'Other'
        ]
      },
      date_of_last_exposure: {
        type: String,
        match: /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])-\d{4}$/
      },
      support_or_intervention_received: { type: String },
      notes: { type: String }
    },
    
    gender_identity: {
      gender_identity: {
        type: String,
        enum: [
          'Male', 'Female', 'Non-binary', 'Transgender',
          'Other', 'Prefer not to say'
        ]
      },
      notes: { type: String }
    },
    
    sexual_orientation: {
      sexual_orientation: {
        type: String,
        enum: [
          'Straight', 'Heterosexual', 'Homosexual', 'Bisexual',
          'Pansexual', 'Asexual', 'Queer', 'Questioning',
          'Other', 'Prefer not to say'
        ]
      },
      notes: { type: String }
    },
    
    nutrients_history: {
      dietary_preferences: { type: String },
      supplement_usage: {
        type: String,
        enum: ['Yes', 'Occasionally', 'No']
      },
      notes: { type: String }
    }
  }
}, {
  timestamps: true
});

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
