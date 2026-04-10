# JOBSY - AI-Powered Job Search & Career Management Platform

A sophisticated, multi-agent AI platform that intelligently manages your career by orchestrating job searches, email communications, calendar events, and personalized insights. Built with modern AI/LLM integrations, MCP (Model Context Protocol) servers, and a full-stack architecture.

---

## 🎯 Overview

**MCP Integrat** is an intelligent career management system that combines:
- **AI-Powered Job Matching** - Finds and ranks job opportunities based on your profile
- **Smart Email Processing** - Drafts, manages, and prioritizes job-related communications
- **Calendar Intelligence** - Automatically extracts and schedules interview events from emails
- **Conversational Agent** - Ask Jobsy chatbot for career guidance and insights
- **Resume Analysis** - Intelligent document processing and profile management
- **Workflow Orchestration** - Multi-agent coordination for complex career workflows

The platform uses **Model Context Protocol (MCP)** for secure, standardized communication with external services (Gmail, Google Calendar, job boards) and leverages multiple LLM providers for intelligent decision-making.

---

## 🏗️ Project Structure

```
mcpintegrat/
├── backend/                    # Node.js Express API server
│   ├── src/
│   │   ├── app.js             # Express application setup
│   │   ├── index.js           # Server entry point
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Route handlers
│   │   ├── routes/            # API route definitions
│   │   ├── models/            # MongoDB/Mongoose schemas
│   │   ├── services/          # Business logic services
│   │   ├── middleware/        # Express middleware
│   │   ├── jobs/              # Scheduled job runners
│   │   ├── db/                # Database connections
│   │   └── utils/             # Utility functions
│   ├── package.json
│   └── requirements.txt
│
├── client/                     # Python AI orchestration layer
│   ├── ask_jobsy/            # Chatbot & conversation engine
│   │   ├── chat_api.py       # FastAPI endpoints
│   │   ├── executor.py       # Task execution logic
│   │   ├── planner.py        # Planning & workflow management
│   │   ├── memory.py         # Conversation memory
│   │   └── rag.py            # Retrieval Augmented Generation
│   │
│   ├── orchestrator/         # Multi-agent orchestration
│   │   ├── runner.py         # Workflow execution engine
│   │   ├── client.py         # entrypoint
│   │   ├── calendar_agent.py # Calendar event management
│   │   ├── email_agent.py    # Email processing & drafting
│   │   ├── job_agent.py      # Job search & matching
│   │   ├── planner.py        # Workflow planning
│   │   └── redis_client.py   # State management
│   │
│   ├── mcp/                  # MCP client & integration
│   │   ├── client.py         # MCP client wrapper
│   │   ├── server.py         # MCP server management
│   │   └── manual_test*.py   # Testing utilities
│   │
│   ├── backend_client/       # Backend API client
│   │   ├── agent_api.py      # Agent endpoints
│   │   ├── user_api.py       # User management
│   │   ├── email_api.py      # Email operations
│   │   ├── job_wrapper.py    # Job search wrapper
│   │   └── ...               # Other API clients
│   │
│   ├── llm/                  # LLM provider integrations
│   │   ├── groq_client.py    # Groq API client
│   │   ├── openai_client.py  # OpenAI API client
│   │   ├── llm_service.py    # LLM abstraction layer
│   │   ├── job_matching_service.py
│   │   └── prompts/          # LLM prompt templates
│   │
│   ├── rag/                  # Retrieval Augmented Generation
│   │   ├── embeddings.py     # Embedding generation
│   │   ├── vector_store.py   # Vector database
│   │   ├── ingest.py         # Document ingestion
│   │   └── retrieve.py       # Query & retrieval
│   │
│   ├── schemas/              # Pydantic & data schemas
│   │   ├── job.py
│   │   ├── email.py
│   │   ├── calendar.py
│   │   ├── resume.py
│   │   └── memory.py
│   │
│   ├── evaluators/           # Response evaluation
│   │   ├── confidence.py
│   │   ├── usefulness.py
│   │   └── retention.py
│   │
│   ├── wrappers/             # External service wrappers
│   │   ├── gmail_wrapper.py
│   │   ├── calendar_wrapper.py
│   │   ├── resume_wrapper.py
│   │   └── job_wrapper.py
│   │
│   ├── utils/
│   ├── tests/
│   └── requirements.txt
│
├── mcp_servers/              # Model Context Protocol servers
│   ├── calendar_mcp/         # Google Calendar MCP server
│   │   ├── calendar_service.py
│   │   ├── auth.py
│   │   └── credentials.json
│   ├── gmail_mcp/            # Gmail MCP server
│   ├── job_search_mcp/       # Job search MCP server
│   └── resume_mcp/           # Resume analysis MCP server
│
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx          # Entry point
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service calls
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Utility functions
│   │   ├── styles/           # CSS modules
│   │   └── assets/           # Static assets
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── eslint.config.js
│
├── infra/                    # Infrastructure as Code
│   ├── docker/               # Docker configuration
│   ├── k8s/                  # Kubernetes manifests
│   └── terraform/            # Terraform IaC
│
├── docs/                     # Documentation
│   ├── architecture.md       # System architecture
│   ├── agent_flow.md         # Agent workflow diagrams
│   └── mcp_contracts.md      # MCP protocol specifications
│
├── package.json              # Root package configuration
├── requirements.txt          # Python dependencies
├── email.css                 # Global styles
└── README.md                 # This file
```

---

## 🚀 Key Features

### 1. **AI-Powered Job Matching**
- Intelligent job search and ranking algorithms
- Profile-based matching using rule based filtering and then using groq llm
- Real-time job tracking and notifications
- Application history management

### 2. **Smart Email Processing**
- AI-generated email drafts for job applications
- Email categorization and prioritization (digest generation)
- Automatic reply suggestions
- Email thread tracking and analysis

### 3. **Calendar Intelligence**
- Automatic interview scheduling from email invitations
- Event extraction using AI
- Calendar sync with Google Calendar via MCP
- Meeting preparation and reminders

### 4. **Conversational AI (Ask Jobsy)**
- FastAPI-based chatbot endpoint
- Multi-turn conversation memory
- Context-aware responses using RAG
- Integration with job search, email, and calendar agents

### 5. **Multi-Agent Orchestration**
- Calendar Agent - Manages event creation and scheduling
- Email Agent - Handles email drafting and communication
- Job Agent - Drives job search and matching
- Planner - Coordinates workflow execution
- Unified workflow engine for complex tasks

### 6. **MCP Server Integrations**
- **Calendar MCP** - Google Calendar operations
- **Gmail MCP** - Email reading and composition
- **Job Search MCP** - Job board integrations
- **Resume MCP** - Document parsing and analysis

### 7. **LLM Provider Support**
- **Groq API** - Fast inference with open models
- **OpenAI API** - GPT models for advanced tasks
- Pluggable LLM service layer
- Prompt template management

---

## 📋 Tech Stack

### Backend
- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js 5.2+
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Google OAuth 2.0
- **Cache**: Redis
- **Job Scheduler**: node-cron
- **File Upload**: Multer
- **Security**: bcrypt for password hashing
- **APIs**: Google APIs (Gmail, Calendar, Drive)

### Client / Python Layer
- **Framework**: FastAPI
- **LLM Clients**: Groq SDK, OpenAI
- **Vector DB**: [Configured in `rag/`]
- **Async**: asyncio, aiohttp
- **Data Validation**: Pydantic
- **Testing**: pytest
- **Utilities**: python-dotenv, Redis client

### Frontend
- **Framework**: React 19.2
- **Build Tool**: Vite 7.2
- **Routing**: React Router 7.11
- **Styling**: CSS Modules + Lucide React icons
- **Auth**: @react-oauth/google
- **Markdown**: react-markdown
- **Utilities**: date-fns for date handling

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **IaC**: Terraform
- **Protocol**: Model Context Protocol (MCP)

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.9+
- MongoDB instance
- Redis instance
- Google OAuth credentials (Google Cloud Console)
- API keys for Groq and/or OpenAI

### Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Configure: MONGODB_URI, JWT_SECRET, CORS_ORIGIN, Google API credentials, etc.

# Start development server
npm run dev

# Seed test data (optional)
npm run seed:emails
```

**Environment Variables** (.env):
```env
MONGODB_URI=mongodb://localhost:27017/mcpintegrat
JWT_SECRET=your_jwt_secret_key
PORT=5000
CORS_ORIGIN=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

**Frontend runs on**: `http://localhost:5173`

### Python Client Setup

```bash
cd client
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Configure: LLM API keys, backend URLs, MCP server details, etc.

#run client from root folder
python -m uvicorn client.orchestrator.client:app --reload

# Run tests
pytest
```

**Environment Variables** (.env):
```env
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key
BACKEND_URL=http://localhost:5000
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_key
```

### MCP Servers Setup

Each MCP server requires specific configuration:

#### Calendar MCP
```bash
cd mcp_servers/calendar_mcp
python -m server
# Requires: Google Calendar API credentials (credentials.json)
```

#### Gmail MCP
```bash
cd mcp_servers/gmail_mcp
python -m server
# Requires: Gmail API credentials
```

#### Job Search MCP
```bash
cd mcp_servers/job_search_mcp
python -m server
# Requires: Job board API keys
```

---

## 🔌 API Endpoints

### Core Backend API

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user

#### User Profile
- `GET /api/user/:id` - Get user profile
- `PUT /api/user/:id` - Update profile
- `GET /api/profile/resume` - Get resume
- `POST /api/profile/resume` - Upload resume

#### Jobs
- `GET /api/jobs` - List jobs
- `POST /api/jobs/search` - Search jobs
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs/apply` - Apply to job
- `GET /api/jobs/tracking` - Get application tracking

#### Emails
- `GET /api/emails` - List emails
- `POST /api/emails/draft` - Generate email draft
- `POST /api/emails/send` - Send email
- `POST /api/emails/digest` - Generate email digest
- `GET /api/emails/query` - Query emails

#### Calendar
- `GET /api/calendar/events` - List calendar events
- `POST /api/calendar/events` - Create event
- `PUT /api/calendar/events/:id` - Update event
- `DELETE /api/calendar/events/:id` - Delete event

#### AI/Chat
- `POST /api/ai/ask` - Ask Jobsy chatbot

---

## 🤖 Agent Workflows

### Job Search Workflow
1. **User Action**: Initiates job search or receives job recommendation
2. **Job Agent** fetches matching positions using MCP Job Search server
3. **LLM Analysis** evaluates job fit based on user profile
4. **Results** cached in Redis and returned to frontend

### Email Management Workflow
1. **Gmail MCP** fetches user emails
2. **Email Agent** categorizes and analyzes messages
3. **LLM** generates contextual draft responses
4. **User** reviews and sends via backend API

### Calendar Integration Workflow
1. **Email Agent** detects calendar invitations
2. **Calendar MCP** extracts event details
3. **Calendar Agent** creates events with AI-enhanced details
4. **Reminders** configured in Google Calendar

### Conversational Flow (Ask Jobsy)
1. **FastAPI** receives user message
2. **JWT validation** and authorization
3. **Memory Module** loads conversation history
4. **Planner** determines required actions/agents
5. **Executor** runs relevant agents
6. **RAG** retrieves contextual information
7. **LLM** generates response
8. **Memory** stores interaction
9. **Response** returned to user

---

## 📊 MCP (Model Context Protocol)

The platform uses MCP for standardized communication with external services:

### MCP Server Architecture
- **Location**: `mcp_servers/` directory
- **Protocol**: JSON-RPC 2.0 over stdio/HTTP
- **Authentication**: Service-specific (OAuth, API keys)

### Available Tools (per server)
Each MCP server exposes tools and resources:
- **Calendar**: create_event, update_event, list_events, extract_from_email
- **Gmail**: list_emails, read_email, send_email, draft_email
- **Job Search**: search_jobs, get_job_details, track_applications
- **Resume**: parse_resume, extract_skills, match_with_jobs

### Securing MCP Connections
- Use environment variables for credentials
- Implement JWT validation in Python client
- Rate limiting on MCP endpoints
- Logging and audit trails

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Python Client Tests
```bash
cd client
pytest                          # Run all tests
pytest tests/ -v               # Verbose output
pytest tests/test_agent.py     # Specific test file
pytest --cov=client            # With coverage report
```

### MCP Server Tests
```bash
cd mcp_servers/calendar_mcp
python manual_test.py
```

---

## 📝 Environment Configuration

### Root Level
- `.env` - Shared configuration (Redis, MongoDB)

### Backend (`backend/.env`)
- Database connections
- JWT secret
- Google OAuth credentials
- CORS settings
- API ports

### Client (`client/.env`)
- LLM API keys (Groq, OpenAI)
- Backend API URL
- Redis configuration
- MCP server endpoints

### Frontend (`frontend/.env`)
- Backend API base URL
- Google OAuth client ID
- Feature flags

---

## 🔐 Security Considerations

1. **API Authentication**: JWT tokens with expiration
2. **OAuth Integration**: Google OAuth 2.0 for user auth
3. **Password Security**: bcrypt hashing with salt rounds
4. **CORS**: Configured for specific origins
5. **Input Validation**: Pydantic schemas and Express middleware
6. **Rate Limiting**: Implement on critical endpoints
7. **Secrets Management**: Use environment variables, never commit .env files
8. **Data Privacy**: GDPR-compliant data handling

---

## 🤝 Contributing

1. Clone the repository
   ```bash
   git clone https://github.com/Sid-MNNIT/MCP.git
   cd MCP
   ```

2. Create a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes and commit
   ```bash
   git commit -m "Add your feature description"
   ```

4. Push to your fork and create a Pull Request
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Standards
- Backend: JavaScript ES6+, consistent with Express.js conventions
- Client: Python 3.9+, PEP 8 style guide, type hints recommended
- Frontend: React functional components, hooks, CSS modules

---

## 📚 Documentation

Detailed documentation available in the `docs/` directory:
- [Architecture Overview](docs/architecture.md) - System design and components
- [Agent Flow Diagrams](docs/agent_flow.md) - Workflow visualizations
- [MCP Contracts](docs/mcp_contracts.md) - Protocol specifications and tools

---

## 🐛 Troubleshooting

### Backend Issues
- **Connection refused**: Ensure MongoDB and Redis are running
- **JWT errors**: Verify JWT_SECRET matches across backend and client
- **Google API errors**: Check credentials and scopes in Google Cloud Console

### Frontend Issues
- **API 404 errors**: Verify backend is running and CORS_ORIGIN is correct
- **OAuth login fails**: Confirm Google Client ID in .env
- **Vite dev server issues**: Clear node_modules and reinstall dependencies

### Python Client Issues
- **Import errors**: Ensure virtual environment is activated
- **LLM API errors**: Verify API keys and rate limits in Groq/OpenAI dashboards
- **Redis connection**: Check Redis server is running on configured port

---

## 📄 License

[Specify your license - MIT, Apache, etc.]

---

## 👥 Contact & Support

- **Project Repository**: [GitHub Link]
- **Issues**: GitHub Issues
- **Email**: [your email]
- **Discord/Slack**: [Community channel if applicable]

---

## 🗓️ Roadmap

### Upcoming Features
- [ ] Advanced job matching with ML models
- [ ] Native mobile app (React Native)
- [ ] Interview preparation module
- [ ] Salary negotiation assistant
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with more job boards
- [ ] Custom resume builder

### Performance Improvements
- [ ] Vector database optimization
- [ ] Redis caching strategies
- [ ] GraphQL API (alternative to REST)
- [ ] WebSocket for real-time updates

---

**Built with ❤️ for career success**
