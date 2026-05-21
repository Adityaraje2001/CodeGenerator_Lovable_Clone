# Coder Buddy

An AI-powered engineering project planner that automates project planning and code generation using a multi-agent system powered by LangGraph and Groq.

## Overview

Coder Buddy is an intelligent system that takes a user's project prompt and breaks it down into a structured plan, then automatically generates code based on that plan. It uses a three-stage agent pipeline:

1. **Planner Agent** - Analyzes the user's project requirements and creates a structured plan
2. **Architect Agent** - Transforms the plan into detailed implementation tasks
3. **Coder Agent** - Executes the tasks and generates the actual code

## Features

- 🤖 Multi-agent AI system using LangGraph
- 📋 Automatic project planning from natural language prompts
- 💻 Automated code generation and file management
- 🔄 Recursive task execution with configurable depth
- 📁 Full file system integration (read, write, list files)

## Prerequisites

- Python 3.11 or higher
- Groq API key (for accessing the language model)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd app_builder
```

2. Create a virtual environment:
```bash
python -m venv .venv
```

3. Activate the virtual environment:

**On Windows:**
```bash
.venv\Scripts\activate
```

**On macOS/Linux:**
```bash
source .venv/bin/activate
```

4. Install dependencies:
```bash
pip install -e .
```

5. Set up environment variables:
Create a `.env` file in the root directory and add your Groq API key:
```
GROQ_API_KEY=your_groq_api_key_here
```

## Usage

Run the application with:
```bash
python main.py
```

You can also specify a custom recursion limit:
```bash
python main.py --recursion-limit 50
```

### Example

```bash
$ python main.py
Enter your project prompt: Create a simple HTML/CSS landing page for a tech startup
```

The system will then:
1. Parse your requirements into a structured plan
2. Break it down into implementation tasks
3. Generate the necessary files automatically

## Project Structure

```
app_builder/
├── main.py                 # Entry point
├── pyproject.toml         # Project configuration and dependencies
├── README.md              # This file
├── agent/                 # Agent implementation
│   ├── __init__.py
│   ├── graph.py          # Multi-agent LangGraph workflow
│   ├── prompts.py        # Prompt templates for agents
│   ├── states.py         # State definitions
│   ├── tools.py          # File system and utility tools
│   └── generated_project/ # Sample output
├── generated_project/     # Output directory for generated projects
│   ├── app.js
│   ├── index.html
│   └── styles.css
```

## Dependencies

- **groq** - API client for Groq language models
- **langchain** - LLM framework and agents
- **langchain-groq** - Groq integration for LangChain
- **langgraph** - Agentic workflow orchestration
- **pydantic** - Data validation
- **python-dotenv** - Environment variable management

## Architecture

The system uses LangGraph to orchestrate a multi-stage workflow:

```
User Prompt
    ↓
[Planner Agent] → Creates Plan
    ↓
[Architect Agent] → Creates TaskPlan
    ↓
[Coder Agent] → Executes Tasks (Iterative)
    ↓
Generated Files
```

Each agent:
- Takes the previous agent's output as input
- Processes it using the Groq language model
- Returns structured output for the next stage

## Advanced Features

- **Recursion Limit**: Control the depth of agent iteration with the `-r` flag
- **Structured Output**: Pydantic models ensure type-safe data flow between agents
- **File Management**: Agents can read, write, and list files in the project directory
- **Error Handling**: Comprehensive error handling and user-friendly error messages

## Configuration

### Environment Variables

- `GROQ_API_KEY` - Your Groq API key (required)

### Command Line Options

- `-r, --recursion-limit` - Set the maximum recursion depth (default: 100)

## Troubleshooting

### KeyboardInterrupt
Press `Ctrl+C` to safely cancel an operation at any time.

### API Errors
Ensure your `GROQ_API_KEY` is correctly set in the `.env` file and has appropriate access permissions.

### File Permission Errors
Ensure the `generated_project/` directory exists and has write permissions.

## License

[Add your license information here]

## Contributing

[Add contribution guidelines here]

## Support

For issues or questions, please create an issue in the repository.
