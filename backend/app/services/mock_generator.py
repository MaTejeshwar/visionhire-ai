import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from app.config import settings

# Sample candidates data
MOCK_CANDIDATES = [
    {
        "filename": "alex_mercer_fullstack.pdf",
        "name": "Alex Mercer",
        "email": "alex.mercer@email.dev",
        "phone": "+1 (555) 019-2834",
        "linkedin": "https://linkedin.com/in/alexmercer-dev",
        "github": "https://github.com/alexmercer",
        "summary": "Senior Full Stack Engineer with 8+ years of experience designing, building, and deploying scalable web applications. Passionate about Python, React, Next.js, and cloud architecture (AWS). Strong leader with experience mentoring developers and leading agile teams.",
        "skills": "Python, React, TypeScript, Next.js, Node.js, FastAPI, Docker, AWS, PostgreSQL, Redis, CI/CD, Git, System Design, Agile",
        "experience": [
            {
                "title": "Lead Software Engineer",
                "company": "SaaSify Inc.",
                "duration": "2022 - Present",
                "desc": "Lead a team of 6 engineers to rebuild the core dashboard in Next.js 14 and FastAPI, improving page load speeds by 40% and increasing user engagement. Architected microservices deployed on AWS ECS using Docker. Established CI/CD pipelines using GitHub Actions."
            },
            {
                "title": "Senior Software Engineer",
                "company": "CodeVenture Labs",
                "duration": "2018 - 2022",
                "desc": "Built and maintained multiple full-stack applications using Python, Django, and React. Optimized SQL databases (PostgreSQL) and implemented Redis caching, reducing API latency by 50%. Led the migration from monolithic system to Docker-based services."
            }
        ],
        "education": [
            {
                "degree": "M.S. in Computer Science",
                "school": "Stanford University",
                "year": "2018"
            },
            {
                "degree": "B.S. in Computer Science",
                "school": "University of California, Berkeley",
                "year": "2016"
            }
        ]
    },
    {
        "filename": "sarah_connor_ml.pdf",
        "name": "Sarah Connor",
        "email": "sarah.connor@ai-labs.org",
        "phone": "+1 (555) 042-9988",
        "linkedin": "https://linkedin.com/in/sarah-connor-ml",
        "github": "https://github.com/sconnor-ml",
        "summary": "Data Scientist and Machine Learning Engineer with 4 years of experience building predictive models and deploying deep learning pipelines. Strong foundation in statistical analysis, NLP, PyTorch, and Scikit-Learn. Experienced in processing large-scale datasets and optimizing neural networks.",
        "skills": "Python, PyTorch, TensorFlow, Scikit-Learn, Pandas, NumPy, spaCy, SQL, PostgreSQL, Docker, Git, Machine Learning, Deep Learning, NLP",
        "experience": [
            {
                "title": "Machine Learning Engineer",
                "company": "DeepMinded AI",
                "duration": "2022 - Present",
                "desc": "Designed and deployed a state-of-the-art NLP model using spaCy and PyTorch for sentiment analysis on 10M+ daily reviews, boosting accuracy by 15% compared to baseline. Engineered robust data processing pipelines with Pandas and SQL."
            },
            {
                "title": "Junior Data Scientist",
                "company": "DataInsights Corp",
                "duration": "2020 - 2022",
                "desc": "Implemented regression and classification models using Scikit-Learn to optimize customer churn prediction, saving the company $120k annually. Built interactive internal dashboards to visualize model outputs."
            }
        ],
        "education": [
            {
                "degree": "B.S. in Mathematics & Computer Science",
                "school": "Massachusetts Institute of Technology (MIT)",
                "year": "2020"
            }
        ]
    },
    {
        "filename": "john_doe_junior_frontend.pdf",
        "name": "John Doe",
        "email": "john.doe@webdev.com",
        "phone": "+1 (555) 088-7711",
        "linkedin": "https://linkedin.com/in/johndoe-web",
        "github": "https://github.com/johndoe",
        "summary": "Enthusiastic and detail-oriented Junior Frontend Developer with 1.5 years of experience building responsive, accessible web interfaces. Fluent in React, JavaScript, HTML, and CSS. Passionate about beautiful UI/UX, micro-animations, and optimizing frontend performance.",
        "skills": "React, JavaScript, HTML, CSS, Tailwind CSS, TypeScript, Figma, Git, Next.js, Redux, Jest",
        "experience": [
            {
                "title": "Frontend Developer",
                "company": "PixelPerfect Agency",
                "duration": "2024 - Present",
                "desc": "Developed clean, responsive landing pages and user dashboards using React and Tailwind CSS. Translated design mockups from Figma into pixel-perfect, accessible code. Collaborated with backend developers to integrate REST APIs."
            }
        ],
        "education": [
            {
                "degree": "B.S. in Information Technology",
                "school": "University of Washington",
                "year": "2023"
            }
        ]
    },
    {
        "filename": "jane_smith_pm.pdf",
        "name": "Jane Smith",
        "email": "jane.smith@product.io",
        "phone": "+1 (555) 011-2233",
        "linkedin": "https://linkedin.com/in/janesmith-pm",
        "github": "https://github.com/janesmith-prod",
        "summary": "Technical Product Manager with 6+ years of experience leading cross-functional teams to launch SaaS products. Expert in Agile, Scrum, product strategy, and roadmapping. Skilled in data analytics, SQL, user research, and wireframing.",
        "skills": "Product Management, Agile, Scrum, Jira, Confluence, SQL, Product Design, Wireframing, Figma, User Research, Analytics, Leadership",
        "experience": [
            {
                "title": "Product Manager",
                "company": "SaaSFlow Technologies",
                "duration": "2021 - Present",
                "desc": "Launched a B2B integration platform that grew from 0 to 50k active monthly users. Wrote detailed PRDs, managed the sprint backlog in Jira, and coordinated between engineering, design, and marketing teams."
            },
            {
                "title": "Associate Product Manager",
                "company": "AppCraft Labs",
                "duration": "2019 - 2021",
                "desc": "Conducted extensive user interviews and analyzed behavior data using SQL and Amplitude, defining features that reduced user onboarding friction by 25%. Supported the senior PM in managing product releases."
            }
        ],
        "education": [
            {
                "degree": "MBA in Technology Management",
                "school": "Cornell University",
                "year": "2019"
            },
            {
                "degree": "B.S. in Business Administration",
                "school": "University of Michigan",
                "year": "2017"
            }
        ]
    },
    {
        "filename": "marcus_devops.pdf",
        "name": "Marcus Aurelius",
        "email": "marcus.devops@cloud.net",
        "phone": "+1 (555) 099-8877",
        "linkedin": "https://linkedin.com/in/marcusdevops",
        "github": "https://github.com/marcus-cloud",
        "summary": "DevOps Architect and Site Reliability Engineer with 10 years of experience managing infrastructure at scale. Expert in cloud services (AWS, GCP), containerization (Docker, Kubernetes), Infrastructure as Code (Terraform), and robust CI/CD engineering.",
        "skills": "AWS, GCP, Docker, Kubernetes, Terraform, Ansible, Jenkins, GitHub Actions, Linux, Nginx, Prometheus, Grafana, Python, Bash, CI/CD",
        "experience": [
            {
                "title": "Infrastructure Lead",
                "company": "GlobalScale Corp",
                "duration": "2020 - Present",
                "desc": "Architected and managed multi-region Kubernetes clusters on AWS (EKS) hosting 100+ microservices, achieving 99.99% uptime. Reduced cloud infrastructure spend by 35% through terraform-based resource optimization and autoscaling."
            },
            {
                "title": "DevOps Engineer",
                "company": "CloudNimbus",
                "duration": "2016 - 2020",
                "desc": "Built automated deployments using Terraform and Jenkins. Migrated legacy VM applications into Docker containers, accelerating deployment speed by 3x. Configured Prometheus and Grafana for system monitoring."
            }
        ],
        "education": [
            {
                "degree": "B.S. in Computer Engineering",
                "school": "Georgia Institute of Technology",
                "year": "2015"
            }
        ]
    }
]

def generate_pdf(candidate: dict, output_dir: str):
    """Generates a clean, professional, single-page resume PDF for testing."""
    file_path = os.path.join(output_dir, candidate["filename"])
    
    # 0.75 in margins
    doc = SimpleDocTemplate(
        file_path, 
        pagesize=letter,
        rightMargin=54, 
        leftMargin=54, 
        topMargin=54, 
        bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Styles
    name_style = ParagraphStyle(
        'ResumeName',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#111827'),  # Slate 900
        spaceAfter=4
    )
    
    contact_style = ParagraphStyle(
        'ResumeContact',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#4B5563'),  # Slate 600
        spaceAfter=12
    )
    
    section_title_style = ParagraphStyle(
        'ResumeSection',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#4F46E5'),  # Indigo 600
        spaceBefore=10,
        spaceAfter=4
    )
    
    body_style = ParagraphStyle(
        'ResumeBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#1F2937'),  # Slate 800
        spaceAfter=8
    )
    
    job_title_style = ParagraphStyle(
        'ResumeJobTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#111827'),
    )
    
    job_company_style = ParagraphStyle(
        'ResumeJobCompany',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#4B5563'),
    )
    
    job_desc_style = ParagraphStyle(
        'ResumeJobDesc',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#374151'),
        spaceAfter=6
    )
    
    story = []
    
    # Header
    story.append(Paragraph(candidate["name"], name_style))
    contact_info = f"Email: {candidate['email']}  |  Phone: {candidate['phone']}<br/>LinkedIn: {candidate['linkedin']}  |  GitHub: {candidate['github']}"
    story.append(Paragraph(contact_info, contact_style))
    
    # Divider line
    story.append(Spacer(1, 4))
    
    # Summary
    story.append(Paragraph("PROFESSIONAL SUMMARY", section_title_style))
    story.append(Paragraph(candidate["summary"], body_style))
    
    # Skills
    story.append(Paragraph("TECHNICAL SKILLS", section_title_style))
    story.append(Paragraph(candidate["skills"], body_style))
    
    # Work Experience
    story.append(Paragraph("WORK EXPERIENCE", section_title_style))
    for exp in candidate["experience"]:
        # Job and Company Header
        title_para = Paragraph(f"{exp['title']} — <i>{exp['company']}</i>", job_title_style)
        duration_para = Paragraph(f"<font color='#6B7280'>{exp['duration']}</font>", ParagraphStyle('Dur', parent=styles['Normal'], fontName='Helvetica', fontSize=9.5, alignment=2)) # Align Right
        
        # Use a table to layout title and duration on the same line
        t = Table([[title_para, duration_para]], colWidths=[350, 154])
        t.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
            ('TOPPADDING', (0,0), (-1,-1), 2),
        ]))
        story.append(t)
        story.append(Paragraph(exp["desc"], job_desc_style))
        story.append(Spacer(1, 4))
        
    # Education
    story.append(Paragraph("EDUCATION", section_title_style))
    for edu in candidate["education"]:
        edu_para = Paragraph(f"<b>{edu['degree']}</b> — {edu['school']}", body_style)
        year_para = Paragraph(f"<font color='#6B7280'>{edu['year']}</font>", ParagraphStyle('Year', parent=styles['Normal'], fontName='Helvetica', fontSize=9.5, alignment=2))
        
        t = Table([[edu_para, year_para]], colWidths=[350, 154])
        t.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
            ('TOPPADDING', (0,0), (-1,-1), 2),
        ]))
        story.append(t)
        
    doc.build(story)

def generate_all_mock_resumes(output_dir: str):
    """Generates all mock resumes in the specified directory."""
    os.makedirs(output_dir, exist_ok=True)
    for candidate in MOCK_CANDIDATES:
        generate_pdf(candidate, output_dir)
    return [os.path.join(output_dir, c["filename"]) for c in MOCK_CANDIDATES]
