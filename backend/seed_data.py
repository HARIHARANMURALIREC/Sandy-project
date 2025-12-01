"""
Seed script to populate the database with initial data
"""
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import User, Module, Quiz
import hashlib

def hash_password(password: str) -> str:
    """Hash a password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

# Create tables
Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    
    try:
        # Helper function to get or create module
        def get_or_create_module(title, description, content):
            existing = db.query(Module).filter(Module.title == title).first()
            if existing:
                return existing
            module = Module(title=title, description=description, content=content)
            db.add(module)
            db.flush()
            return module
        
        # Helper function to add quizzes if they don't exist
        def add_quizzes_if_new(module, quizzes_data):
            existing_count = db.query(Quiz).filter(Quiz.module_id == module.id).count()
            if existing_count == 0:
                for quiz_data in quizzes_data:
                    quiz = Quiz(
                        module_id=module.id,
                        question=quiz_data['question'],
                        option_a=quiz_data['option_a'],
                        option_b=quiz_data['option_b'],
                        option_c=quiz_data['option_c'],
                        option_d=quiz_data['option_d'],
                        correct_answer=quiz_data['correct_answer']
                    )
                    db.add(quiz)
                print(f"  ✅ Added {len(quizzes_data)} quizzes for '{module.title}'")
            else:
                print(f"  ⚠️  Module '{module.title}' already has quizzes, skipping")
        
        # Create admin user if it doesn't exist
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            admin = User(
                username="admin",
                email="admin@rights360.com",
                password=hash_password("admin123"),
                role="admin"
            )
            db.add(admin)
            print("  ✅ Created admin user")
        else:
            print("  ⚠️  Admin user already exists")
        
        # Create test user if it doesn't exist
        test_user = db.query(User).filter(User.username == "testuser").first()
        if not test_user:
            test_user = User(
                username="testuser",
                email="test@example.com",
                password=hash_password("test123"),
                role="user"
            )
            db.add(test_user)
            print("  ✅ Created test user")
        else:
            print("  ⚠️  Test user already exists")
        
        # Module 1: Fundamental Rights
        module1 = get_or_create_module(
            title="Fundamental Rights",
            description="Learn about the basic rights guaranteed to all citizens under the Constitution.",
            content="""
# Fundamental Rights

Fundamental rights are a group of rights that have been recognized by a high degree of protection from encroachment. These rights are specifically identified in the Constitution.

## Key Points:

### Right to Equality (Articles 14-18)
- Equality before law and equal protection of laws
- Prohibition of discrimination on grounds of religion, race, caste, sex, or place of birth
- Equality of opportunity in matters of public employment
- Abolition of untouchability
- Abolition of titles

### Right to Freedom (Articles 19-22)
- Freedom of speech and expression
- Freedom to assemble peacefully without arms
- Freedom to form associations or unions
- Freedom to move freely throughout the territory
- Freedom to reside and settle in any part
- Freedom to practice any profession or occupation

### Right against Exploitation (Articles 23-24)
- Prohibition of traffic in human beings and forced labor
- Prohibition of employment of children in factories

### Right to Freedom of Religion (Articles 25-28)
- Freedom of conscience and free profession, practice, and propagation of religion
- Freedom to manage religious affairs
- Freedom from payment of taxes for promotion of any religion
- Freedom from attending religious instruction

### Cultural and Educational Rights (Articles 29-30)
- Protection of interests of minorities
- Right of minorities to establish educational institutions

### Right to Constitutional Remedies (Article 32)
- Right to move the Supreme Court for enforcement of fundamental rights

## Why Are They Important?

Fundamental rights protect the liberty and freedom of the citizens against any invasion by the state. They are the basic human rights of all citizens. These rights universally apply to all citizens, irrespective of race, place of birth, religion, caste, creed, or gender.

## Limitations

While fundamental rights are essential, they are not absolute. Reasonable restrictions can be imposed in the interest of sovereignty, integrity, security of the state, friendly relations with foreign states, public order, decency, or morality.
            """
        )
        
        # Quizzes for Module 1
        quizzes_m1 = [
            {
                'question': "Which article guarantees equality before law?",
                'option_a': "Article 12",
                'option_b': "Article 14",
                'option_c': "Article 19",
                'option_d': "Article 21",
                'correct_answer': "B"
            },
            {
                'question': "What does Article 19 guarantee?",
                'option_a': "Right to Life",
                'option_b': "Right to Education",
                'option_c': "Freedom of Speech",
                'option_d': "Right to Property",
                'correct_answer': "C"
            },
            {
                'question': "Which articles deal with Right against Exploitation?",
                'option_a': "Articles 14-18",
                'option_b': "Articles 19-22",
                'option_c': "Articles 23-24",
                'option_d': "Articles 25-28",
                'correct_answer': "C"
            },
            {
                'question': "Which article provides the Right to Constitutional Remedies?",
                'option_a': "Article 32",
                'option_b': "Article 21",
                'option_c': "Article 14",
                'option_d': "Article 19",
                'correct_answer': "A"
            },
            {
                'question': "Are fundamental rights absolute?",
                'option_a': "Yes, they cannot be restricted",
                'option_b': "No, reasonable restrictions can be imposed",
                'option_c': "Only for government officials",
                'option_d': "Only during emergencies",
                'correct_answer': "B"
            }
        ]
        add_quizzes_if_new(module1, quizzes_m1)
        
        # Module 2: Right to Life and Personal Liberty
        module2 = get_or_create_module(
            title="Right to Life and Personal Liberty",
            description="Understand your right to life, liberty, and protection from arbitrary detention.",
            content="""
# Right to Life and Personal Liberty

Article 21 of the Constitution guarantees the right to life and personal liberty, which is one of the most fundamental rights available to every person.

## Key Provisions:

### Article 21: Protection of Life and Personal Liberty
"No person shall be deprived of his life or personal liberty except according to procedure established by law."

## What Does This Mean?

### Right to Life
- Not just mere animal existence
- Right to live with human dignity
- Includes right to livelihood, health, education, and clean environment
- Protection from arbitrary deprivation of life

### Personal Liberty
- Freedom from physical restraint
- Protection from arbitrary arrest and detention
- Right to move freely
- Right to privacy

## Important Judgments:

### Maneka Gandhi v. Union of India (1978)
- Established that procedure must be fair, just, and reasonable
- Introduced the concept of "due process of law"

### Olga Tellis v. Bombay Municipal Corporation (1985)
- Right to livelihood is part of right to life
- Pavement dwellers cannot be evicted without alternative accommodation

### Vishaka v. State of Rajasthan (1997)
- Right to work with dignity
- Guidelines for prevention of sexual harassment at workplace

## Exceptions:
- Lawful arrest and detention
- Preventive detention (with safeguards)
- Death penalty (in rarest of rare cases)

## Your Rights:
1. Right to be informed of grounds of arrest
2. Right to consult a lawyer
3. Right to be produced before a magistrate within 24 hours
4. Right to bail (except in certain cases)
5. Right to fair trial
            """
        )
        
        quizzes_m2 = [
            {
                'question': "Which article guarantees the right to life and personal liberty?",
                'option_a': "Article 19",
                'option_b': "Article 20",
                'option_c': "Article 21",
                'option_d': "Article 22",
                'correct_answer': "C"
            },
            {
                'question': "What does the right to life include?",
                'option_a': "Only physical existence",
                'option_b': "Right to live with human dignity",
                'option_c': "Only protection from death",
                'option_d': "Only right to property",
                'correct_answer': "B"
            },
            {
                'question': "In which case was it established that procedure must be fair and reasonable?",
                'option_a': "Olga Tellis case",
                'option_b': "Maneka Gandhi case",
                'option_c': "Vishaka case",
                'option_d': "Kesavananda Bharati case",
                'correct_answer': "B"
            },
            {
                'question': "What is the maximum time a person can be detained without being produced before a magistrate?",
                'option_a': "12 hours",
                'option_b': "24 hours",
                'option_c': "48 hours",
                'option_d': "72 hours",
                'correct_answer': "B"
            },
            {
                'question': "Right to livelihood is part of which fundamental right?",
                'option_a': "Right to Equality",
                'option_b': "Right to Life",
                'option_c': "Right to Freedom",
                'option_d': "Right to Property",
                'correct_answer': "B"
            }
        ]
        add_quizzes_if_new(module2, quizzes_m2)
        
        # Module 3: Consumer Rights
        module3 = get_or_create_module(
            title="Consumer Rights and Protection",
            description="Learn about your rights as a consumer and how to protect yourself from unfair trade practices.",
            content="""
# Consumer Rights and Protection

Consumer rights are essential for protecting individuals from unfair business practices and ensuring quality products and services.

## Six Fundamental Consumer Rights:

### 1. Right to Safety
- Protection against goods and services that are hazardous to life and property
- Right to be protected from products that are unsafe
- Manufacturers must ensure product safety

### 2. Right to Information
- Right to be informed about quality, quantity, potency, purity, standard, and price
- Right to know about ingredients, manufacturing date, expiry date
- Right to accurate and truthful advertising

### 3. Right to Choose
- Right to choose from a variety of products at competitive prices
- Freedom from monopoly practices
- Right to access different brands and services

### 4. Right to be Heard
- Right to voice complaints and grievances
- Right to consumer forums and redressal mechanisms
- Right to fair treatment in consumer disputes

### 5. Right to Redressal
- Right to seek compensation for unfair trade practices
- Right to replacement or refund for defective products
- Right to access consumer courts

### 6. Right to Consumer Education
- Right to acquire knowledge about consumer rights
- Right to be aware of responsibilities
- Right to make informed choices

## Consumer Protection Act, 2019:

### Key Features:
- Three-tier redressal system (District, State, National)
- E-filing of complaints
- Product liability
- Unfair contracts
- Mediation as alternative dispute resolution

## How to File a Complaint:

1. **District Consumer Forum**: For claims up to ₹1 crore
2. **State Commission**: For claims between ₹1 crore and ₹10 crores
3. **National Commission**: For claims above ₹10 crores

## Common Consumer Issues:
- Defective products
- Overcharging
- False advertising
- Poor service quality
- Unfair trade practices
- Deficiency in services

## Your Responsibilities:
- Be aware of your rights
- Read labels and terms carefully
- Keep bills and receipts
- File complaints promptly
- Be honest in your dealings
            """
        )
        
        quizzes_m3 = [
            {
                'question': "How many fundamental consumer rights are there?",
                'option_a': "Four",
                'option_b': "Five",
                'option_c': "Six",
                'option_d': "Seven",
                'correct_answer': "C"
            },
            {
                'question': "Which consumer right protects you from hazardous products?",
                'option_a': "Right to Information",
                'option_b': "Right to Safety",
                'option_c': "Right to Choose",
                'option_d': "Right to Redressal",
                'correct_answer': "B"
            },
            {
                'question': "For claims up to ₹1 crore, where should you file a complaint?",
                'option_a': "State Commission",
                'option_b': "National Commission",
                'option_c': "District Consumer Forum",
                'option_d': "Supreme Court",
                'correct_answer': "C"
            },
            {
                'question': "What is the maximum time limit for filing a consumer complaint?",
                'option_a': "1 year",
                'option_b': "2 years",
                'option_c': "3 years",
                'option_d': "No time limit",
                'correct_answer': "B"
            },
            {
                'question': "Which right ensures you can choose from different brands?",
                'option_a': "Right to Safety",
                'option_b': "Right to Information",
                'option_c': "Right to Choose",
                'option_d': "Right to Redressal",
                'correct_answer': "C"
            }
        ]
        add_quizzes_if_new(module3, quizzes_m3)
        
        # Module 4: Women's Rights
        module4 = get_or_create_module(
            title="Women's Rights and Gender Equality",
            description="Comprehensive guide to women's legal rights, protections, and gender equality laws.",
            content="""
# Women's Rights and Gender Equality

Women's rights are fundamental human rights that ensure equality, dignity, and protection for all women.

## Constitutional Provisions:

### Article 15(3)
- Special provisions for women and children
- Allows positive discrimination for empowerment

### Article 16
- Equality of opportunity in public employment
- No discrimination on grounds of sex

### Article 39(a) and (d)
- Equal right to adequate means of livelihood
- Equal pay for equal work

## Key Legislation:

### The Protection of Women from Domestic Violence Act, 2005
- Protection from physical, emotional, sexual, and economic abuse
- Right to residence
- Protection orders and monetary relief

### The Sexual Harassment of Women at Workplace Act, 2013
- Prevention of sexual harassment
- Mandatory Internal Complaints Committee
- Redressal mechanisms

### The Dowry Prohibition Act, 1961
- Prohibition of giving or taking dowry
- Penalties for dowry-related offenses

### The Maternity Benefit Act, 1961
- 26 weeks paid maternity leave
- Medical bonus
- Protection from dismissal during pregnancy

### The Equal Remuneration Act, 1976
- Equal pay for equal work
- No discrimination in recruitment

## Rights of Women:

### 1. Right to Education
- Free and compulsory education
- Equal access to educational institutions

### 2. Right to Property
- Equal inheritance rights (Hindu Succession Act)
- Right to own and dispose of property

### 3. Right to Work
- Equal employment opportunities
- Protection from discrimination
- Safe working environment

### 4. Right to Health
- Access to healthcare services
- Reproductive rights
- Maternity benefits

### 5. Right to Dignity
- Protection from violence
- Right to live with dignity
- Protection from harassment

## Important Legal Protections:

### Against Domestic Violence
- Can file complaint with police
- Can seek protection orders
- Right to maintenance

### Against Sexual Harassment
- Complaint to Internal Committee
- Confidentiality maintained
- Protection from retaliation

### Against Dowry
- Can file FIR
- Protection from harassment
- Right to separate residence

## Support Systems:
- Women's helpline: 181
- National Commission for Women
- Legal aid services
- NGOs and support groups

## Your Rights:
1. Right to live free from violence
2. Right to equal opportunities
3. Right to equal pay
4. Right to maternity benefits
5. Right to property and inheritance
6. Right to education
7. Right to healthcare
            """
        )
        
        quizzes_m4 = [
            {
                'question': "How many weeks of paid maternity leave are women entitled to?",
                'option_a': "12 weeks",
                'option_b': "20 weeks",
                'option_c': "26 weeks",
                'option_d': "30 weeks",
                'correct_answer': "C"
            },
            {
                'question': "Which act protects women from domestic violence?",
                'option_a': "IPC Section 498A",
                'option_b': "Protection of Women from Domestic Violence Act, 2005",
                'option_c': "Dowry Prohibition Act",
                'option_d': "Criminal Law Amendment Act",
                'correct_answer': "B"
            },
            {
                'question': "What is the helpline number for women in distress?",
                'option_a': "100",
                'option_b': "1091",
                'option_c': "181",
                'option_d': "112",
                'correct_answer': "C"
            },
            {
                'question': "Which article allows special provisions for women?",
                'option_a': "Article 14",
                'option_b': "Article 15(3)",
                'option_c': "Article 16",
                'option_d': "Article 21",
                'correct_answer': "B"
            },
            {
                'question': "What is mandatory in every workplace under the Sexual Harassment Act?",
                'option_a': "Security cameras",
                'option_b': "Internal Complaints Committee",
                'option_c': "Women employees only",
                'option_d': "Separate restrooms",
                'correct_answer': "B"
            }
        ]
        add_quizzes_if_new(module4, quizzes_m4)
        
        # Module 5: Labor Rights
        module5 = get_or_create_module(
            title="Labor Rights and Workers' Protection",
            description="Essential knowledge about workers' rights, labor laws, and workplace protections.",
            content="""
# Labor Rights and Workers' Protection

Labor rights ensure fair treatment, safe working conditions, and social security for all workers.

## Fundamental Labor Rights:

### 1. Right to Work
- Freedom to choose employment
- Protection from forced labor
- Right to fair wages

### 2. Right to Fair Wages
- Minimum wages as per law
- Equal pay for equal work
- Timely payment of wages

### 3. Right to Safe Working Conditions
- Safe and healthy workplace
- Protection from occupational hazards
- Safety equipment and training

### 4. Right to Rest and Leisure
- Reasonable working hours
- Weekly rest day
- Annual leave with wages

### 5. Right to Form Unions
- Freedom of association
- Right to collective bargaining
- Protection from discrimination for union activities

## Key Labor Laws:

### The Factories Act, 1948
- Maximum 8 hours work per day
- Weekly holiday
- Annual leave with wages
- Safety and health provisions

### The Minimum Wages Act, 1948
- Minimum wages for different categories
- Revision of minimum wages
- Payment of overtime

### The Payment of Wages Act, 1936
- Timely payment of wages
- Deductions only as per law
- Payment in current coin or currency

### The Employees' Provident Fund Act, 1952
- Provident fund contributions
- Pension benefits
- Family pension scheme

### The Employees' State Insurance Act, 1948
- Medical benefits
- Sickness benefits
- Maternity benefits
- Disability benefits

### The Industrial Disputes Act, 1947
- Settlement of disputes
- Lay-off and retrenchment procedures
- Unfair labor practices

### The Maternity Benefit Act, 1961
- 26 weeks paid leave
- Medical bonus
- Protection from dismissal

## Workers' Rights:

### Working Hours
- Maximum 8 hours per day
- Maximum 48 hours per week
- Overtime payment for extra hours

### Leave Entitlements
- Annual leave (earned leave)
- Sick leave
- Casual leave
- Maternity leave (for women)

### Social Security
- Provident fund
- Pension
- Health insurance
- Gratuity

### Safety and Health
- Safe working environment
- Safety equipment
- Medical facilities
- Compensation for injuries

## Grievance Redressal:

### Labor Courts
- For individual disputes
- Quick resolution
- Cost-effective

### Industrial Tribunals
- For collective disputes
- Complex matters
- Binding decisions

### Labor Commissioner
- For wage disputes
- Safety violations
- Administrative matters

## Your Rights as a Worker:
1. Right to minimum wages
2. Right to safe working conditions
3. Right to rest and leisure
4. Right to form unions
5. Right to social security
6. Right to fair treatment
7. Right to grievance redressal
            """
        )
        
        quizzes_m5 = [
            {
                'question': "What is the maximum working hours per day under the Factories Act?",
                'option_a': "6 hours",
                'option_b': "8 hours",
                'option_c': "10 hours",
                'option_d': "12 hours",
                'correct_answer': "B"
            },
            {
                'question': "Which act provides for provident fund contributions?",
                'option_a': "Payment of Wages Act",
                'option_b': "Employees' Provident Fund Act",
                'option_c': "Factories Act",
                'option_d': "Minimum Wages Act",
                'correct_answer': "B"
            },
            {
                'question': "What is the maximum working hours per week?",
                'option_a': "40 hours",
                'option_b': "44 hours",
                'option_c': "48 hours",
                'option_d': "52 hours",
                'correct_answer': "C"
            },
            {
                'question': "Which act provides medical and sickness benefits to workers?",
                'option_a': "ESIC Act",
                'option_b': "Factories Act",
                'option_c': "Minimum Wages Act",
                'option_d': "Payment of Wages Act",
                'correct_answer': "A"
            },
            {
                'question': "Workers have the right to form what?",
                'option_a': "Companies",
                'option_b': "Unions",
                'option_c': "Partnerships",
                'option_d': "Corporations",
                'correct_answer': "B"
            }
        ]
        add_quizzes_if_new(module5, quizzes_m5)
        
        # Module 6: Right to Information
        module6 = get_or_create_module(
            title="Right to Information (RTI)",
            description="Learn how to access government information and ensure transparency in governance.",
            content="""
# Right to Information (RTI)

The Right to Information Act, 2005 empowers citizens to access information from public authorities, promoting transparency and accountability.

## What is RTI?

The Right to Information Act gives every citizen the right to:
- Request information from any public authority
- Inspect documents and records
- Take certified copies of documents
- Obtain information in electronic format

## Who Can Use RTI?

- Any citizen of India
- Can be filed individually or jointly
- No need to give reason for seeking information
- Can be filed in any language

## What Information Can You Get?

### Available Information:
- Government decisions and policies
- Budget and expenditure details
- Tender documents
- Service delivery records
- Performance reports
- Any information held by public authority

### Exempted Information:
- Information affecting sovereignty and integrity
- Information received in confidence from foreign governments
- Information that would harm commercial interests
- Personal information (unless larger public interest)
- Information that would impede investigation

## How to File RTI Application:

### Step 1: Identify the Public Authority
- Determine which department holds the information
- Find the Public Information Officer (PIO)

### Step 2: Write the Application
- Use simple language
- Be specific about information sought
- Mention the period if applicable
- No need to give reason

### Step 3: Submit the Application
- Submit to PIO or Assistant PIO
- Pay fee of ₹10 (cash, DD, or court fee stamp)
- Get acknowledgment

### Step 4: Receive Information
- Information should be provided within 30 days
- 48 hours for life and liberty cases
- 35 days if application transferred

## Fees and Charges:

### Application Fee:
- ₹10 for application
- Additional charges for photocopies (₹2 per page)
- Inspection charges (first hour free, ₹5 per subsequent hour)

### Fee Exemption:
- Below Poverty Line (BPL) cardholders exempt
- No fee for first appeal

## Appeals:

### First Appeal:
- If information not provided or unsatisfactory
- File with First Appellate Authority within 30 days
- No fee required

### Second Appeal:
- If first appeal unsatisfactory
- File with Information Commission within 90 days
- Fee of ₹50 (exempt for BPL)

## Important Provisions:

### Time Limits:
- 30 days for normal cases
- 48 hours for life and liberty
- 35 days if transferred
- 5 days for transfer to correct authority

### Penalties:
- ₹250 per day (max ₹25,000) for delay
- Disciplinary action for malafide denial
- Compensation for loss or detriment

## Your Rights:
1. Right to seek information
2. Right to inspect documents
3. Right to get certified copies
4. Right to appeal
5. Right to know reasons for denial
6. Right to get information in preferred format

## Tips for Effective RTI:
- Be specific and clear
- Keep copies of application
- Follow up if no response
- Use online RTI portals
- Know your rights
            """
        )
        
        quizzes_m6 = [
            {
                'question': "What is the fee for filing an RTI application?",
                'option_a': "₹5",
                'option_b': "₹10",
                'option_c': "₹20",
                'option_d': "₹50",
                'correct_answer': "B"
            },
            {
                'question': "Within how many days should information be provided under RTI?",
                'option_a': "15 days",
                'option_b': "30 days",
                'option_c': "45 days",
                'option_d': "60 days",
                'correct_answer': "B"
            },
            {
                'question': "For life and liberty cases, information must be provided within?",
                'option_a': "24 hours",
                'option_b': "48 hours",
                'option_c': "7 days",
                'option_d': "15 days",
                'correct_answer': "B"
            },
            {
                'question': "Who can file an RTI application?",
                'option_a': "Only government employees",
                'option_b': "Only lawyers",
                'option_c': "Any citizen of India",
                'option_d': "Only taxpayers",
                'correct_answer': "C"
            },
            {
                'question': "What is the maximum penalty for delay in providing information?",
                'option_a': "₹5,000",
                'option_b': "₹10,000",
                'option_c': "₹25,000",
                'option_d': "₹50,000",
                'correct_answer': "C"
            }
        ]
        add_quizzes_if_new(module6, quizzes_m6)
        
        db.commit()
        print("✅ Database seeded successfully!")
        print(f"\n📚 Total Modules Created: {db.query(Module).count()}")
        print(f"📝 Total Quizzes Created: {db.query(Quiz).count()}")
        print("\n👤 Admin credentials:")
        print("   Username: admin")
        print("   Password: admin123")
        print("\n👤 Test user credentials:")
        print("   Username: testuser")
        print("   Password: test123")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
