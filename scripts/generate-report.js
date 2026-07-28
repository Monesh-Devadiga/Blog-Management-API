const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, TableLayoutType, WidthType,
  AlignmentType, BorderStyle, PageBreak,
} = require('docx');
const fs = require('fs');
const path = require('path');

async function generateReport() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Calibri', size: 22, color: '333333' },
          paragraph: { spacing: { after: 200, line: 276 } },
        },
      },
    },
    sections: [
      ...coverPage(),
      ...techStackSection(),
      ...projectStructureSection(),
      ...implementationStepsSection(),
      ...apiDocumentationSection(),
      ...securityMeasuresSection(),
      ...conclusionSection(),
    ],
  });

  const outDir = path.join(__dirname, '..');
  const outPath = path.join(outDir, 'Blog_Management_API_Report.docx');
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outPath, buffer);
  console.log(`Report generated: ${outPath}`);
}

function coverPage() {
  return [
    {
      children: [
        new Paragraph({ spacing: { before: 4000 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'Blog Management API', bold: true, size: 56, color: '2B5797' })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
          children: [new TextRun({ text: 'Week 3 - Development Report', size: 36, color: '666666' })],
        }),
        new Paragraph({ spacing: { before: 1200 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'Node.js Development Internship', size: 28, color: '888888' })],
        }),
        new Paragraph({ spacing: { before: 600 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: `Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, size: 24, color: '888888' })],
        }),
        new Paragraph({ children: [new PageBreak()] }),
      ],
    },
  ];
}

function techStackSection() {
  const techs = [
    ['Node.js', 'JavaScript runtime'],
    ['Express.js', 'Web framework'],
    ['MongoDB + Mongoose', 'Database & ODM'],
    ['JSON Web Tokens (JWT)', 'Token-based authentication'],
    ['bcryptjs', 'Password hashing (10 salt rounds)'],
    ['Multer', 'File upload handling'],
    ['express-validator', 'Request validation'],
    ['dotenv', 'Environment variable management'],
    ['CORS', 'Cross-Origin Resource Sharing'],
  ];
  return [
    {
      children: [
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: '2. Technology Stack', bold: true })] }),
        ...techs.map(([t, d]) =>
          new Paragraph({
            spacing: { before: 80, after: 40 },
            indent: { left: 400 },
            children: [
              new TextRun({ text: '\u2022 ', size: 24 }),
              new TextRun({ text: `${t}`, bold: true, size: 24 }),
              new TextRun({ text: ` \u2013 ${d}`, size: 24 }),
            ],
          })
        ),
        new Paragraph({ children: [new PageBreak()] }),
      ],
    },
  ];
}

function projectStructureSection() {
  const lines = [
    ['blog-api/', '', true],
    ['├── config/', '', true],
    ['│   └── db.js', 'MongoDB connection', false],
    ['├── controllers/', '', true],
    ['│   ├── authController.js', 'Auth logic', false],
    ['│   ├── blogController.js', 'Blog CRUD', false],
    ['│   └── categoryController.js', 'Category CRUD', false],
    ['├── middleware/', '', true],
    ['│   ├── auth.js', 'JWT verification', false],
    ['│   ├── errorHandler.js', 'Error handling', false],
    ['│   ├── upload.js', 'File upload config', false],
    ['│   └── validate.js', 'Request validation', false],
    ['├── models/', '', true],
    ['│   ├── User.js', 'User schema', false],
    ['│   ├── Blog.js', 'Blog schema', false],
    ['│   └── Category.js', 'Category schema', false],
    ['├── routes/', '', true],
    ['│   ├── authRoutes.js', 'Auth routes', false],
    ['│   ├── blogRoutes.js', 'Blog routes', false],
    ['│   └── categoryRoutes.js', 'Category routes', false],
    ['├── utils/', '', true],
    ['│   └── helpers.js', 'Utility functions', false],
    ['├── scripts/', '', true],
    ['│   ├── seed.js', 'Demo data seeder', false],
    ['│   └── export-db.js', 'DB export script', false],
    ['├── uploads/', 'File storage directory', false],
    ['├── server.js', 'Entry point', false],
    ['├── .env', 'Environment variables', false],
    ['└── package.json', 'Dependencies', false],
  ];

  return [
    {
      children: [
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: '3. Project Structure', bold: true })] }),
        ...lines.map(([name, desc, isDir]) =>
          new Paragraph({
            spacing: { before: 20, after: 20 },
            children: [
              new TextRun({ text: `  ${name}`, bold: isDir, size: 22 }),
              ...(desc ? [new TextRun({ text: `  \u2013 ${desc}`, size: 22, italics: true })] : []),
            ],
          })
        ),
        new Paragraph({ children: [new PageBreak()] }),
      ],
    },
  ];
}

function implementationStepsSection() {
  return [
    {
      children: [
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: '4. Implementation Steps', bold: true })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 300 }, children: [new TextRun({ text: '4.1 Auth Module', bold: true })] }),
        new Paragraph({
          spacing: { before: 100 },
          children: [new TextRun({ text: 'User schema with name, email, password, avatar, and role fields. Pre-save hook hashes password with bcrypt (10 rounds). comparePassword method for login. Controller handles register, login, getMe. JWT middleware verifies Bearer tokens and attaches user to req.' })],
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 300 }, children: [new TextRun({ text: '4.2 Blog Module', bold: true })] }),
        new Paragraph({
          spacing: { before: 100 },
          children: [new TextRun({ text: 'Blog schema with title, content, excerpt, author (ref User), category (ref Category), tags, coverImage, status (draft/published), publishedAt, and viewCount. Full CRUD controller with:' })],
        }),
        ...[
          'createBlog \u2013 Validates and creates a new blog post with optional cover image upload.',
          'getBlogs \u2013 Supports pagination (page, limit), search (title, content, tags via regex), filtering (status, category, author, tag, date range), and sorting (any field, asc/desc). Returns count, total, page, totalPages.',
          'getBlog \u2013 Fetches a single blog by MongoDB ID. Increments viewCount on access.',
          'updateBlog (PUT) \u2013 Full or partial update. Only author or admin can update.',
          'deleteBlog \u2013 Removes blog by ID. Only author or admin can delete.',
          'getMyBlogs \u2013 Returns all blogs belonging to the authenticated user.',
        ].map((item) =>
          new Paragraph({
            spacing: { before: 40 },
            indent: { left: 400 },
            children: [new TextRun({ text: `\u2022 ${item}`, size: 22 })],
          })
        ),

        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 300 }, children: [new TextRun({ text: '4.3 Category Module', bold: true })] }),
        new Paragraph({
          spacing: { before: 100 },
          children: [new TextRun({ text: 'Category schema with name, description, and auto-generated slug. CRUD controller with create, getAll, getById, update, delete. Only admin users can create, update, or delete categories. Protection against deleting categories that have associated blogs.' })],
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 300 }, children: [new TextRun({ text: '4.4 Server Setup', bold: true })] }),
        new Paragraph({
          spacing: { before: 100 },
          children: [new TextRun({ text: 'Express configured with CORS, JSON parser, URL-encoded parser. Static file serving for uploads directory. Auth routes mounted at /api/auth, blog routes at /api/blogs, category routes at /api/categories. 404 fallback for unknown routes. Centralized error handler for CastError (invalid ID), ValidationError, and duplicate key (11000) errors.' })],
        }),

        new Paragraph({ children: [new PageBreak()] }),
      ],
    },
  ];
}

function apiDocumentationSection() {
  const endpoints = [
    ['Method', 'Endpoint', 'Description', 'Auth'],
    ['POST', '/api/auth/register', 'Register a new user', 'No'],
    ['POST', '/api/auth/login', 'Login user', 'No'],
    ['GET', '/api/auth/me', 'Get current user profile', 'Yes'],
    ['GET', '/api/blogs', 'Get all blogs (with search/filter)', 'Optional'],
    ['GET', '/api/blogs/my-blogs', 'Get current user blogs', 'Yes'],
    ['POST', '/api/blogs', 'Create a new blog', 'Yes'],
    ['GET', '/api/blogs/:id', 'Get single blog by ID', 'Optional'],
    ['PUT', '/api/blogs/:id', 'Update blog (full update)', 'Owner/Admin'],
    ['PATCH', '/api/blogs/:id', 'Update blog (partial update)', 'Owner/Admin'],
    ['DELETE', '/api/blogs/:id', 'Delete blog by ID', 'Owner/Admin'],
    ['GET', '/api/categories', 'Get all categories', 'No'],
    ['POST', '/api/categories', 'Create category', 'Admin'],
    ['GET', '/api/categories/:id', 'Get single category', 'No'],
    ['PUT', '/api/categories/:id', 'Update category', 'Admin'],
    ['DELETE', '/api/categories/:id', 'Delete category', 'Admin'],
    ['GET', '/api/health', 'Health check', 'No'],
  ];

  const endpointRows = endpoints.map((row, i) =>
    new TableRow({
      children: row.map((cell) =>
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: cell, bold: i === 0, size: 20 })] })],
          shading: i === 0 ? { type: 'clear', color: '2B5797', fill: '2B5797' } : undefined,
        })
      ),
      tableHeader: i === 0,
    })
  );

  return [
    {
      children: [
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: '5. API Documentation', bold: true })] }),
        new Paragraph({ spacing: { before: 100 }, children: [new TextRun({ text: 'Base URL: http://localhost:5000/api', bold: true })] }),
        new Paragraph({ spacing: { before: 100 }, children: [new TextRun({ text: 'Authentication: Include JWT token in header \u2013 Authorization: Bearer <token>' })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200 }, children: [new TextRun({ text: '5.1 Register User (POST)', bold: true })] }),
        new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: 'Input: {"name": "John", "email": "john@test.com", "password": "pass123"}' })] }),
        new Paragraph({ spacing: { before: 40 }, children: [new TextRun({ text: '\u2022 Status: 201 Created' })] }),
        new Paragraph({ spacing: { before: 20 }, children: [new TextRun({ text: '\u2022 Response: Successfully created user record with token' })] }),
        new Paragraph({ spacing: { before: 60, after: 100 }, children: [new TextRun({ text: 'Result: [Screenshot: register.png]', italics: true, color: '888888' })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200 }, children: [new TextRun({ text: '5.2 Login User (POST)', bold: true })] }),
        new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: 'Input: {"email": "john@test.com", "password": "pass123"}' })] }),
        new Paragraph({ spacing: { before: 40 }, children: [new TextRun({ text: '\u2022 Status: 200 OK' })] }),
        new Paragraph({ spacing: { before: 20 }, children: [new TextRun({ text: '\u2022 Response: User data with JWT token' })] }),
        new Paragraph({ spacing: { before: 60, after: 100 }, children: [new TextRun({ text: 'Result: [Screenshot: login.png]', italics: true, color: '888888' })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200 }, children: [new TextRun({ text: '5.3 Get All Blogs (GET)', bold: true })] }),
        new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: 'Input: ?search=nodejs&page=1&limit=5&status=published' })] }),
        new Paragraph({ spacing: { before: 40 }, children: [new TextRun({ text: '\u2022 Status: 200 OK' })] }),
        new Paragraph({ spacing: { before: 20 }, children: [new TextRun({ text: '\u2022 Response: Paginated blog list with count, total, page, totalPages, hasNextPage, hasPrevPage' })] }),
        new Paragraph({ spacing: { before: 60, after: 100 }, children: [new TextRun({ text: 'Result: [Screenshot: get_all_blogs.png]', italics: true, color: '888888' })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200 }, children: [new TextRun({ text: '5.4 Get Blog By ID (GET)', bold: true })] }),
        new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: 'Input: /api/blogs/<BLOG_ID>' })] }),
        new Paragraph({ spacing: { before: 40 }, children: [new TextRun({ text: '\u2022 Status: 200 OK' })] }),
        new Paragraph({ spacing: { before: 20 }, children: [new TextRun({ text: '\u2022 Response: Single blog with author and category populated' })] }),
        new Paragraph({ spacing: { before: 60, after: 100 }, children: [new TextRun({ text: 'Result: [Screenshot: get_blog_by_id.png]', italics: true, color: '888888' })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200 }, children: [new TextRun({ text: '5.5 Get Blogs by Status (GET)', bold: true })] }),
        new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: 'Input: /api/blogs?status=draft' })] }),
        new Paragraph({ spacing: { before: 40 }, children: [new TextRun({ text: '\u2022 Status: 200 OK' })] }),
        new Paragraph({ spacing: { before: 20 }, children: [new TextRun({ text: '\u2022 Response: Filtered blog list showing only draft blogs' })] }),
        new Paragraph({ spacing: { before: 60, after: 100 }, children: [new TextRun({ text: 'Result: [Screenshot: filter_by_status.png]', italics: true, color: '888888' })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200 }, children: [new TextRun({ text: '5.6 Get Blogs by Category (GET)', bold: true })] }),
        new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: 'Input: /api/blogs?category=<CATEGORY_ID>' })] }),
        new Paragraph({ spacing: { before: 40 }, children: [new TextRun({ text: '\u2022 Status: 200 OK' })] }),
        new Paragraph({ spacing: { before: 20 }, children: [new TextRun({ text: '\u2022 Response: Filtered blog list for specific category' })] }),
        new Paragraph({ spacing: { before: 60, after: 100 }, children: [new TextRun({ text: 'Result: [Screenshot: filter_by_category.png]', italics: true, color: '888888' })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200 }, children: [new TextRun({ text: '5.7 Create Blog (POST)', bold: true })] }),
        new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: 'Input: {"title": "...", "content": "...", "category": "...", "tags": [...]}' })] }),
        new Paragraph({ spacing: { before: 40 }, children: [new TextRun({ text: '\u2022 Status: 201 Created' })] }),
        new Paragraph({ spacing: { before: 20 }, children: [new TextRun({ text: '\u2022 Response: Newly created blog with populated author and category' })] }),
        new Paragraph({ spacing: { before: 60, after: 100 }, children: [new TextRun({ text: 'Result: [Screenshot: create_blog.png]', italics: true, color: '888888' })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200 }, children: [new TextRun({ text: '5.8 Update Blog (PUT)', bold: true })] }),
        new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: 'Input: {"title": "Updated Title", "status": "published"}' })] }),
        new Paragraph({ spacing: { before: 40 }, children: [new TextRun({ text: '\u2022 Status: 200 OK' })] }),
        new Paragraph({ spacing: { before: 20 }, children: [new TextRun({ text: '\u2022 Response: Updated blog with all fields' })] }),
        new Paragraph({ spacing: { before: 60, after: 100 }, children: [new TextRun({ text: 'Result: [Screenshot: update_blog.png]', italics: true, color: '888888' })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200 }, children: [new TextRun({ text: '5.9 Delete Blog (DELETE)', bold: true })] }),
        new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: 'Input: /api/blogs/<BLOG_ID>' })] }),
        new Paragraph({ spacing: { before: 40 }, children: [new TextRun({ text: '\u2022 Status: 200 OK' })] }),
        new Paragraph({ spacing: { before: 20 }, children: [new TextRun({ text: '\u2022 Response: Success message confirming deletion' })] }),
        new Paragraph({ spacing: { before: 60, after: 100 }, children: [new TextRun({ text: 'Result: [Screenshot: delete_blog.png]', italics: true, color: '888888' })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200 }, children: [new TextRun({ text: '5.10 Endpoint Summary', bold: true })] }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: endpointRows,
          layout: TableLayoutType.FIXED,
        }),

        new Paragraph({ children: [new PageBreak()] }),
      ],
    },
  ];
}

function securityMeasuresSection() {
  return [
    {
      children: [
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: '6. Security Measures', bold: true })] }),
        ...[
          'Passwords hashed with bcrypt (10 salt rounds)',
          'JWT tokens with 7-day expiration',
          'Password field excluded from query results (select: false)',
          'Input validation on all model fields and request bodies',
          'Role-based access control (user vs admin)',
          'Environment variables for sensitive configuration',
          'Consistent error responses without leaking stack traces in production',
          'CORS enabled for controlled cross-origin requests',
          'File upload type and size validation (images only, max 5MB)',
          'Protected routes prevent unauthorized access to blog modification',
        ].map((item) =>
          new Paragraph({
            spacing: { before: 60 },
            indent: { left: 400 },
            children: [new TextRun({ text: `\u2022 ${item}`, size: 24 })],
          })
        ),
        new Paragraph({ children: [new PageBreak()] }),
      ],
    },
  ];
}

function conclusionSection() {
  return [
    {
      children: [
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: '8. Conclusion', bold: true })] }),
        new Paragraph({
          spacing: { before: 200 },
          children: [new TextRun({ text: 'The Blog Management API was successfully built with all required features: JWT authentication, password hashing, protected routes, full CRUD with pagination and filtering, category management, and file upload support. The project follows RESTful conventions, implements industry-standard security practices, and is modular and extensible.' })],
        }),
        new Paragraph({ spacing: { before: 200 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: '\u2014 End of Report \u2014', italics: true, color: '888888' })],
        }),
      ],
    },
  ];
}

generateReport().catch(console.error);
