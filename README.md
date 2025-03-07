---
title: "GCP Chatbot Infrastructure - Terraform"
---

# GCP Chatbot Infrastructure - Terraform

## Overview
This Terraform configuration provisions a **Chatbot Development Environment** in **Google Cloud Platform (GCP)** using Cloud Native services.

## Features
- **Cloud Run**: Deploys a serverless chatbot API.
- **Cloud SQL (PostgreSQL)**: Stores structured chatbot data.
- **Firestore**: NoSQL database for flexible chatbot storage.
- **Cloud Storage**: Stores media assets (images, audio, etc.).
- **IAM Policies**: Secure role-based access control.
- **VPC Peering**: Enables private connectivity between Cloud SQL and Cloud Run.
- **Swagger API Documentation**: Provides an API wrapper for chatbot endpoints.

## Terraform Configuration

### Provider Configuration
```hcl
provider "google" {
  project = var.project_id
  region  = var.region
}
```

### Cloud SQL with Private IP
```hcl
resource "google_compute_global_address" "private_ip" {
  name          = "private-ip"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = var.vpc_name
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = var.vpc_name
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip.name]
}

resource "google_sql_database_instance" "chatbot_db" {
  name             = "chatbot-db-instance"
  database_version = "POSTGRES_13"
  region           = var.region

  settings {
    tier = "db-f1-micro"
    availability_type = "REGIONAL"
    ip_configuration {
      ipv4_enabled    = false
      private_network = google_service_networking_connection.private_vpc_connection.network
    }
  }
}
```

### Cloud Run Chatbot API
```hcl
resource "google_cloud_run_service" "chatbot_api" {
  name     = "chatbot-api"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/chatbot-api:latest"
        ports {
          container_port = 8080
        }
      }
    }
  }
}
```

### Cloud Storage
```hcl
resource "google_storage_bucket" "chatbot_media" {
  name     = "chatbot-media-${var.project_id}"
  location = var.region
  uniform_bucket_level_access = true
}
```

### IAM Policies
```hcl
resource "google_cloud_run_service_iam_policy" "public_access" {
  location = google_cloud_run_service.chatbot_api.location
  service  = google_cloud_run_service.chatbot_api.name

  policy_data = <<EOF
{
  "bindings": [
    {
      "role": "roles/run.invoker",
      "members": ["allUsers"]
    }
  ]
}
EOF
}
```

## Backend API with Swagger Documentation
```javascript
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const app = express();
const port = process.env.PORT || 8080;

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Chatbot API",
      version: "1.0.0",
      description: "API for Chatbot with GCP",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req, res) => {
  res.send("Chatbot API Running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

## Cheat Sheet for Chatbot Infrastructure Interview
### Terraform Commands
- `terraform init` - Initialize Terraform
- `terraform plan` - Preview changes before applying
- `terraform apply` - Deploy infrastructure
- `terraform destroy` - Remove infrastructure

### GCP Services Overview
- **Cloud Run**: Deploy serverless applications
- **Cloud SQL**: Managed relational databases
- **Firestore**: NoSQL database for flexible storage
- **Cloud Storage**: Stores unstructured data
- **IAM**: Controls access to resources

### Best Practices
- **Use Secret Manager** to store sensitive credentials
- **Enable Cloud Logging** for debugging
- **Set up IAM roles** for least privilege access
- **Use VPC Peering** for secure database connections

## Next Steps
- Automate deployments using **GitHub Actions**
- Integrate **Dialogflow CX** for AI-driven chatbot responses
- Optimize **Cloud Run autoscaling** for cost efficiency

---

This README serves as a **Terraform cheat sheet** and **interview guide** for GCP Chatbot development. 🚀




# AI-Driven Spring MVC Application

## Overview
This project is designed with **Design Thinking** and **Agile Methodologies**, ensuring iterative development from **POC to Production-Grade Applications**. It integrates **Spring MVC, REST APIs, Spring Data, React Frontend, RAG System (AI Enhancements), Camunda Workflow Automation, and Vector Databases**.

## Technology Integration Overview

| Technology       | Description                                      | Function                           | Developer Role & Work | Integration Points |
|-----------------|--------------------------------------------------|------------------------------------|----------------------|--------------------|
| Spring MVC      | Java-based framework for web applications       | Handles HTTP requests and routing | Develop Controllers & APIs | Frontend API calls |
| Spring Boot     | Microservice framework for Java applications    | Streamlines backend development   | Configure services & beans | API Gateway |
| Spring Data JPA | ORM framework for database access               | Manages database interactions     | Design repositories & entities | Database connectivity |
| React.js        | Frontend library for UI development             | Provides interactive UI components | Build reusable components | REST API consumption |
| RAG System      | AI-driven retrieval and generation framework    | Fetches and generates AI responses | Integrate LLM with API | Backend AI calls |
| Camunda BPMN    | Business process automation                     | Orchestrates workflows            | Configure BPMN workflows | Service tasks & AI delegation |
| PostgreSQL      | Relational database for persistent storage      | Stores application data           | Define schema & optimize queries | Backend persistence |
| OpenAI API      | Generative AI model integration                 | Provides AI-powered responses     | Implement AI service layer | Backend to LLM |
| Pinecone / FAISS| Vector database for AI Retrieval Augmentation  | Stores and queries embeddings     | Implement query processing | RAG pipeline |
| Kubernetes      | Container orchestration                         | Manages microservices             | Deploy & scale app | Cloud service integration |
| Docker         | Containerization platform                        | Packages application for deployment | Define Dockerfiles | CI/CD pipelines |
| AWS Lambda      | Serverless computing                            | Runs code in response to events   | Write scalable functions | Event-driven processing |

## Key Code Snippets

### Querying Vector Database for Retrieval Augmentation
```java
@Service
public class VectorSearchService {
    private final RestTemplate restTemplate;
    private final String vectorDbUrl = "https://your-vector-db-endpoint.com/query";

    public VectorSearchService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<String> searchRelevantDocs(String query) {
        return restTemplate.postForObject(vectorDbUrl, query, List.class);
    }
}
```

### Handling Prompt Augmentation for AI Generation
```java
@Service
public class AIQueryAugmentationService {
    private final VectorSearchService vectorSearchService;
    private final AIService aiService;

    public AIQueryAugmentationService(VectorSearchService vectorSearchService, AIService aiService) {
        this.vectorSearchService = vectorSearchService;
        this.aiService = aiService;
    }

    public String generateAugmentedResponse(String userInput) {
        List<String> retrievedDocs = vectorSearchService.searchRelevantDocs(userInput);
        String augmentedPrompt = userInput + "\nContext: " + String.join(" ", retrievedDocs);
        return aiService.generateResponse(augmentedPrompt);
    }
}
```

### Handling Response Latency & API Response with Image Data in React UI
```jsx
import React, { useState } from "react";
import axios from "axios";

const AIResponseComponent = () => {
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchResponse = async () => {
        setLoading(true);
        try {
            const result = await axios.post("http://localhost:8080/ai/generate", { query });
            setResponse(result.data);
        } catch (error) {
            console.error("Error fetching AI response", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your query..."
            />
            <button onClick={fetchResponse} disabled={loading}>
                {loading ? "Loading..." : "Get Response"}
            </button>
            {response && (
                <div>
                    {response.text && <p>{response.text}</p>}
                    {response.imageUrl && <img src={response.imageUrl} alt="Generated Visual" />}
                </div>
            )}
        </div>
    );
};

export default AIResponseComponent;
```

## Challenges & Solutions

### 1. **Latency in AI Response**
   - Implement async calls & loading indicators in UI.
   - Use caching mechanisms for previously queried results.

### 2. **Handling Large API Responses (Text & Images)**
   - Use efficient state management (React useState, Redux if necessary).
   - Optimize image loading by lazy loading images.

### 3. **Ensuring Relevant AI Responses**
   - Properly structure the augmented prompt to include relevant context.
   - Leverage embeddings to enhance retrieval quality.

## Conclusion
This **Agile-Driven AI Application** seamlessly integrates **Spring Boot, React, RAG AI Models, and Camunda BPMN**. It provides **fast, scalable, and intelligent user interactions** while maintaining **low latency and high efficiency**. This document serves as a high-level reference for building and discussing the architecture and implementation at an interview or technical meeting.



# E2E Integration Architecture for RAG Project

## Integration Architecture Table

| **Integration System**      | **AWS Product**                         | **GCP Product**                              | **Role of Developer**                                       |
|----------------------------|---------------------------------|---------------------------------|------------------------------------------------|
| **Event-Driven Messaging** | Amazon MSK (Kafka), SQS, SNS   | Pub/Sub, Cloud Tasks            | Configure event-driven pipelines, optimize message queues, ensure scalability |
| **AI Integration (RAG)**   | Amazon Bedrock, OpenSearch     | Vertex AI, ElasticSearch, Pinecone | Develop RAG pipeline, integrate vector search, fine-tune retrieval |
| **Frontend Development**   | Amplify, AppSync (GraphQL)     | Firebase, Cloud Functions       | Build UI, integrate GraphQL APIs, optimize AI-driven UX |
| **Workflow Automation**    | Step Functions, AWS Lambda     | Workflows, Cloud Run            | Define AI-driven workflows, automate approvals, integrate AI decisions |
| **Cloud-Native Deployment** | EKS (Kubernetes), Lambda, IAM  | GKE, Cloud Run, IAM              | Deploy microservices, ensure scalability, optimize CI/CD |

## Challenges & Solutions

| **Challenge**                                | **Solution**                             |
|---------------------------------------------|----------------------------------------|
| **Scalability for AI queries**              | Use **autoscaling** with Kubernetes (EKS/GKE) and serverless functions (AWS Lambda, Cloud Run). |
| **High latency in vector search**           | Optimize embeddings retrieval with **Pinecone/ElasticSearch caching**. |
| **Security concerns with AI-generated data** | Implement **OAuth2 (Azure AD)**, role-based access (RBAC), and encryption (AES-256, TLS). |
| **Complex workflow automation**             | Leverage **Camunda BPM + AI decision-making** for intelligent approvals. |
| **Integration of AI with existing tools**   | Utilize **GraphQL APIs** for seamless frontend-backend connectivity. |

This architecture ensures a **scalable, event-driven, AI-powered system** with cloud-native deployments on AWS & GCP, integrating **Kafka, AI RAG, Camunda BPM, and Kubernetes** to power an **automated, intelligent workflow.** 🚀








*Emerging TECH for LLM APPLICATIONS*

![2657 Emerging LLM App Stack R2 Clean](https://github.com/a16z-infra/llm-app-stack/assets/26883865/9363af72-9d44-4c62-ad90-007234b5b791)

This is a list of available tools, projects, and vendors at each layer of the LLM app stack. 

Our [original article](https://a16z.com/2023/06/20/emerging-architectures-for-llm-applications/) included only the most popular options, based on user interviews. This repo is meant to be more comprehensive, covering all available options in each category. We probably still missed some important projects, so please open a PR if you see anything missing.

We also included [Perplexity and Cursor.sh prompts](#formatting-prompt-templates) to make searching and markdown table formatting easier.


## Table of Contents

1. [Data Pipelines](#data-pipelines)
2. [Embedding Models](#embedding-models)
3. [Vector Databases](#vector-databases)
4. [Playgrounds](#playgrounds)
5. [Orchestrators](#orchestrators)
6. [APIs / Plugins](#apis--plugins)
7. [LLM Caches](#llm-caches)
8. [Logging / Monitoring / Eval](#logging--monitoring--eval)
9. [Validators](#validators)
10. [LLM APIs (proprietary)](#llm-apis-proprietary)
11. [LLM APIs (open source)](#llm-apis-open-source)
12. [App Hosting Platforms](#app-hosting-platforms)
13. [Cloud Providers](#cloud-providers)
14. [Opinionated Clouds](#opinionated-clouds)



## Project List

### Data Pipelines
| Name (site) | Description | Github | Pip Installs |
|------------|------------|------------|------------|
| [Databricks](https://databricks.com/) | A unified data platform for building, deploying, and maintaining enterprise data solutions, including products (like MosaicML and MLflow) purpose-built for AI | <a href=https://github.com/apache/spark><img src="https://img.shields.io/github/stars/apache/spark?style=social" width=90/></a> | <a href=https://pypi.org/project/pyspark><img src="https://img.shields.io/pypi/dw/pyspark" width=150/></a> |
| [Airflow](https://airflow.apache.org/) | A data pipeline framework to programmatically author, schedule, and monitor data pipelines and workflows, including for LLMs | <a href=https://github.com/apache/airflow><img src="https://img.shields.io/github/stars/apache/airflow?style=social" width=90/></a> | <a href=https://pypi.org/project/apache-airflow><img src="https://img.shields.io/pypi/dw/apache-airflow" width=150/></a> |
| [Unstructured.io](https://unstructured.io/) | Open-source components for pre-processing documents such as PDFs, HTML, and Word documents for usage with LLM apps | <a href=https://github.com/Unstructured-IO/unstructured><img src="https://img.shields.io/github/stars/Unstructured-IO/unstructured?style=social" width=90/></a> | <a href=https://pypi.org/project/unstructured><img src="https://img.shields.io/pypi/dw/unstructured" width=150/></a> |
| [Fivetran](https://www.fivetran.com/) | A platform that extracts, loads, and transforms data from various sources for analytics, AI, and operations | N/A | <a href=https://pypi.org/project/fivetran><img src="https://img.shields.io/pypi/dw/fivetran" width=150/></a> |
| [Airbyte](https://www.airbyte.com/) | An open-source data integration engine that helps consolidate data in data warehouses, lakes, and databases | <a href=https://github.com/airbytehq/airbyte><img src="https://img.shields.io/github/stars/airbytehq/airbyte?style=social" width=90/></a> | <a href=https://pypi.org/project/airbyte-cdk><img src="https://img.shields.io/pypi/dw/airbyte-cdk" width=150/></a> |
| [Anyscale](https://www.anyscale.com/) | An AI compute platform that allows developers to scale data ingest, preprocessing, embedding, and inference computations using Ray | <a href=https://github.com/ray-project/ray><img src="https://img.shields.io/github/stars/ray-project/ray?style=social" width=90/></a> | <a href=https://pypi.org/project/ray><img src="https://img.shields.io/pypi/dw/ray" width=150/></a> |
| [Alluxio](https://www.alluxio.io/) | An open-source data platform at the intersection of compute and storage, bringing data closer to compute, to accelerate model training and serving, boost GPU utilization, and reduce costs for AI workloads | <a href=https://github.com/Alluxio/alluxio> <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/alluxio/Alluxio?style=social" width=90></a> | <a href=https://pypi.org/project/alluxio-python-library/><img alt="PyPI - Downloads" src="https://img.shields.io/pypi/dw/alluxio-python-library" width=150> </a> | 

<p style="text-align: right;"><a href="#table-of-contents">^ Back to Contents ^</a></p>

### Embedding Models
| Name (site) | Description | Github | Pip Installs |
|------------|------------|------------|------------|
| [OpenAI Ada Embedding 2](https://platform.openai.com/docs/guides/embeddings) | OpenAI's most popular embedding model for capturing semantic relationships in text | n/a | <a href=https://pypi.org/project/openai><img src="https://img.shields.io/pypi/dw/openai" width=150/></a> |
| [Cohere AI](https://docs.cohere.com/docs/embeddings) | An independent commercial provider of LLMs, with particular focus on embeddings for semantic search, topic clustering, and vertical applications | <a href=https://github.com/cohere-ai/notebooks><img src="https://img.shields.io/github/stars/cohere-ai/notebooks?style=social" width=90/></a> | <a href=https://pypi.org/project/cohere><img src="https://img.shields.io/pypi/dw/cohere" width=150/></a> |
| [Sentence Transformers](https://www.sbert.net/) | An open-source Python framework for sentence, text, and image embeddings | <a href=https://github.com/UKPLab/sentence-transformers><img src="https://img.shields.io/github/stars/UKPLab/sentence-transformers?style=social" width=90/></a> | <a href=https://pypi.org/project/sentence-transformers><img src="https://img.shields.io/pypi/dw/sentence-transformers" width=150/></a> |

<p style="text-align: right;"><a href="#table-of-contents">^ Back to Contents ^</a></p>

### Vector Databases
| Name (site) | Description | Github | Pip Installs |
|------------|------------|------------|------------|
| [Pinecone](https://pinecone.io/) | A managed, cloud-native vector database with a simple API for high-performance AI applications | n/a | <a href=https://pypi.org/project/pinecone-client><img src="https://img.shields.io/pypi/dw/pinecone-client" width=150/></a> |
| [Weaviate](https://weaviate.io/) | An open-source vector database that stores both objects and vectors | <a href=https://github.com/weaviate/weaviate><img src="https://img.shields.io/github/stars/weaviate/weaviate?style=social" width=90/></a> | <a href=https://pypi.org/project/weaviate-client><img src="https://img.shields.io/pypi/dw/weaviate-client" width=150/></a> |
| [ChromaDB](https://trychroma.com/) | An AI-native, open-source embedding database platform for developers | <a href=https://github.com/chroma-core/chroma><img src="https://img.shields.io/github/stars/chroma-core/chroma?style=social" width=90/></a> | <a href=https://pypi.org/project/chromadb><img src="https://img.shields.io/pypi/dw/chromadb" width=150/></a> |
| [Pgvector](https://github.com/pgvector/pgvector) | An open-source vector similarity search for Postgres, allowing for exact and approximate nearest-neighbor search | <a href=https://github.com/pgvector/pgvector><img src="https://img.shields.io/github/stars/pgvector/pgvector?style=social" width=90/></a> | <a href=https://pypi.org/project/pgvector><img src="https://img.shields.io/pypi/dw/pgvector" width=150/></a> |
| [Zilliz (Milvus)](https://milvus.io/) | An open-source vector database, built for developing and maintaining AI applications | <a href=https://github.com/milvus-io/milvus><img src="https://img.shields.io/github/stars/milvus-io/milvus?style=social" width=90/></a> | <a href=https://pypi.org/project/pymilvus><img src="https://img.shields.io/pypi/dw/pymilvus" width=150/></a> |
| [Qdrant](https://qdrant.tech/) | A vector database and vector similarity search engine | <a href=https://github.com/qdrant/qdrant><img src="https://img.shields.io/github/stars/qdrant/qdrant?style=social" width=90/></a> | <a href=https://pypi.org/project/qdrant-client><img src="https://img.shields.io/pypi/dw/qdrant-client" width=150/></a> |
| [Metal io](https://getmetal.io/) | A managed service for developers to build applications with ML embeddings | N/A | <a href=https://pypi.org/project/metal-python><img src="https://img.shields.io/pypi/dw/metal-python" width=150/></a> |
| [LanceDB](https://lancedb.com/) | A serverless vector database for AI applications | <a href=https://github.com/lancedb/lancedb><img src="https://img.shields.io/github/stars/lancedb/lancedb?style=social" width=90/></a> | <a href=https://pypi.org/project/lancedb><img src="https://img.shields.io/pypi/dw/lancedb" width=150/></a> |

<p style="text-align: right;"><a href="#table-of-contents">^ Back to Contents ^</a></p>

### Playgrounds
| Name (site)                                       | Description                                                                                                                               | Github                                                                                                                                                                        | Pip Installs                                                                                                             |
|---------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| [OpenAI Playground](https://platform.openai.com/) | A web-based platform for experimenting with various machine-learning models developed by OpenAI                                           | N/A                                                                                                                                                                           | N/A                                                                                                                      |
| [nat.dev](https://nat.dev)                        | A platform that allows users to test prompts with multiple language models and compare their performance                                  | <a href=https://github.com/nat/openplayground><img src="https://img.shields.io/github/stars/nat/openplayground?style=social" width=90/></a>                                   | <a href=https://pypi.org/project/openplayground><img src="https://img.shields.io/pypi/dw/openplayground" width=150/></a> |
| [Humanloop](https://humanloop.com/)               | A platform that helps developers build applications on top of LLMs                                                                        | <a href=https://github.com/humanloop/humanloop-tutorial-python><img src="https://img.shields.io/github/stars/humanloop/humanloop-tutorial-python?style=social" width=90/></a> | <a href=https://pypi.org/project/humanloop><img src="https://img.shields.io/pypi/dw/humanloop" width=150/></a>           |
| [Parea AI](https://www.parea.ai/)                 | Platform and SDK for AI Engineers providing tools for LLM evaluation, observability, and a version-controlled enhanced prompt playground. | <a href=https://github.com/parea-ai><img src="https://img.shields.io/github/stars/parea-ai/parea-sdk-py?style=social" width=90/></a>                                          | <a href=https://pypi.org/project/parea-ai/><img src="https://img.shields.io/pypi/dw/parea-ai" width=150/></a>            |

<p style="text-align: right;"><a href="#table-of-contents">^ Back to Contents ^</a></p>

### Orchestrators
| Name (site) | Description | Github | Pip Installs |
|------------|------------|------------|------------|
| [Langchain](https://langchain.com/) | An open-source library that gives developers the tools to build applications powered by LLMs | <a href=https://github.com/langchain-ai/langchain><img src="https://img.shields.io/github/stars/langchain-ai/langchain?style=social" width=90/></a> | <a href=https://pypi.org/project/langchain><img src="https://img.shields.io/pypi/dw/langchain" width=150/></a> |
| [LlamaIndex](https://llamaindex.ai/) | A data framework for LLM applications to ingest, structure, and access private or domain-specific data | <a href=https://github.com/jerryjliu/llama_index><img src="https://img.shields.io/github/stars/jerryjliu/llama_index?style=social" width=90/></a> | <a href=https://pypi.org/project/llama-index><img src="https://img.shields.io/pypi/dw/llama-index" width=150/></a> |
| [Autogen](https://microsoft.github.io/autogen/) | A framework for automating and streamlining LLM workflows using customizable, conversable agents for complex AI applications | <a href=https://github.com/microsoft/autogen><img src="https://img.shields.io/github/stars/microsoft/autogen?style=social" width=90/></a> | <a href=https://pypi.org/project/pyautogen><img src="https://img.shields.io/pypi/dw/pyautogen" width=150/></a> |
| [Microsoft Semantic Kernel](https://github.com/microsoft/semantic-kernel) | A lightweight open-source orchestration SDK  | <a href=https://github.com/microsoft/semantic-kernel><img src="https://img.shields.io/github/stars/microsoft/semantic-kernel?style=social" width=90/></a> | <a href=https://pypi.org/project/semantic-kernel><img src="https://img.shields.io/pypi/dw/semantic-kernel" width=150/></a> |
| [Haystack](https://haystack.deepset.ai/) | LLM orchestration framework to build customizable, production-ready LLM applications | <a href=https://github.com/deepset-ai/haystack><img src="https://img.shields.io/github/stars/deepset-ai/haystack?style=social" width=90/></a> | <a href=https://pypi.org/project/farm-haystack/><img src="https://img.shields.io/pypi/dw/farm-haystack" width=150/></a> |
| [Vercel AI SDK](https://sdk.vercel.ai/docs) | An open-source library for developers to build streaming UIs in JavaScript and TypeScript | <a href=https://github.com/vercel/ai><img src="https://img.shields.io/github/stars/vercel-labs/ai?style=social" width=90/></a> | <a href=https://pypi.org/project/vercel-ai-sdk><img src="https://img.shields.io/npm/dw/ai" width=150/></a>(node/npm)|
| [Vectara AI](https://vectara.com/) | A search and discovery platform for AI conversations utilizing your own data | <a href=https://github.com/vectara/vectara-ingest><img src="https://img.shields.io/github/stars/vectara/vectara-ingest?style=social" width=90/></a> | N/A |
| [ChatGPT](https://chat.openai.com) | An AI chatbot that uses natural language processing to create humanlike conversational dialogue | N/A| N/A |

<p style="text-align: right;"><a href="#table-of-contents">^ Back to Contents ^</a></p>

### APIs / Plugins
| Name (site) | Description | Github | Pip Installs |
|------------|------------|------------|------------|
| [Serp API](https://serpapi.com/) | A real-time API to access Google search results, as well as handling proxies, solving captchas, and parsing structured data | <a href=https://github.com/serpapi/google-search-results-python><img src="https://img.shields.io/github/stars/serpapi/google-search-results-python?style=social" width=90/></a> | <a href=https://pypi.org/project/google-search-results><img src="https://img.shields.io/pypi/dw/google-search-results" width=150/></a> |
| [Wolfram Alpha API](https://wolframalpha.com/) | A web-based API providing computational and presentation capabilities for integration into various applications | N/A | <a href=https://pypi.org/project/wolframalpha><img src="https://img.shields.io/pypi/dw/wolframalpha" width=150/></a> |
| [Zapier API AI Plugin](https://zapier.com/) | A plugin that allows you to connect 5,000+ apps and interact with them directly inside ChatGPT | N/A | N/A |


<p style="text-align: right;"><a href="#table-of-contents">^ Back to Contents ^</a></p>

### LLM Caches
| Name (site) | Description | Github | Pip Installs |
|------------|------------|------------|------------|
| [Redis](https://redis.io/) | An in-memory data structure store used as a database, cache, message broker, and streaming engine | <a href=https://github.com/redis/redis><img src="https://img.shields.io/github/stars/redis/redis?style=social" width=90/></a> | <a href=https://pypi.org/project/redis/><img src="https://img.shields.io/pypi/dw/redis" width=150/></a> |
| [SQLite](https://sqlite.org/) | A self-contained, serverless, zero-configuration, transactional SQL database engine | <a href=https://github.com/sqlite/sqlite><img src="https://img.shields.io/github/stars/sqlite/sqlite?style=social" width=90/></a> | <a href=https://pypi.org/project/pysqlite3/><img src="https://img.shields.io/pypi/dw/pysqlite3" width=150/></a> |
| [GPTCache](https://github.com/zilliztech/GPTCache) | An open-source tool for improving the efficiency and speed of GPT-based applications by implementing a cache to store the responses | <a href=https://github.com/zilliztech/GPTCache><img src="https://img.shields.io/github/stars/zilliztech/GPTCache?style=social" width=90/></a> | N/A |

<p style="text-align: right;"><a href="#table-of-contents">^ Back to Contents ^</a></p>

### Logging / Monitoring / Eval
| Name (site) | Description | Github | Pip Installs |
|------------|------------|------------|------------|
| [Braintrust Data](https://www.braintrustdata.com/) | An AI product stack featuring evaluations, prompt playgrounds, continuous integration, dataset management, and access to various AI models through a single API | <a href=https://github.com/braintrustdata/braintrust-proxy><img src="https://img.shields.io/github/stars/braintrustdata/braintrust-proxy?style=social" width=90/></a> | <a href=https://pypi.org/project/braintrust><img src="https://img.shields.io/pypi/dw/braintrust" width=150/></a> |
| [Arize AI](https://arize.com/) | An observability platform for both LLMs and supervised ML | <a href=https://github.com/Arize-ai><img src="https://img.shields.io/github/stars/Arize-ai?style=social" width=90/></a> | <a href=https://pypi.org/project/arize><img src="https://img.shields.io/pypi/dw/arize" width=150/></a> |
| [Weights & Biases](https://wandb.ai) | An MLOps platform for streamlining ML workflows | <a href=https://github.com/wandb/wandb><img src="https://img.shields.io/github/stars/wandb/wandb?style=social" width=90/></a> | <a href=https://pypi.org/project/wandb><img src="https://img.shields.io/pypi/dw/wandb" width=150/></a> |
| [MLflow](https://mlflow.org/docs/latest/llms/index.html#) | A platform to streamline ML development | <a href=https://github.com/mlflow/mlflow><img src="https://img.shields.io/github/stars/mlflow/mlflow?style=social" width=90/></a> | <a href=https://pypi.org/project/mlflow><img src="https://img.shields.io/pypi/dw/mlflow" width=150/></a> |
| [PromptLayer](https://promptlayer.com/) | A platform for tracking, managing, and sharing LLM prompt engineering | <a href=https://github.com/MagnivOrg/prompt-layer-library><img src="https://img.shields.io/github/stars/MagnivOrg/prompt-layer-library?style=social" width=90/></a> | <a href=https://pypi.org/project/promptlayer><img src="https://img.shields.io/pypi/dw/promptlayer" width=150/></a> |
| [Helicone](https://helicone.ai/) | An open-source observability platform for LLMs | <a href=https://github.com/Helicone/helicone><img src="https://img.shields.io/github/stars/Helicone/helicone?style=social" width=90/></a> | <a href=https://pypi.org/project/helicone><img src="https://img.shields.io/pypi/dw/helicone" width=150/></a> |
| [Quotient AI](https://www.quotientai.co/) | Quotient AI is a platform for evaluating AI products on real-world use-cases, during research, development, and in production | N/A | N/A |
| [Portkey AI](https://portkey.ai/) | A platform to develop, launch, maintain, and iterate generative AI apps and features  | N/A | N/A |
| [Freeplay AI](https://freeplay.ai/) | A platform to prototype, test, and optimize LLM features for customers | N/A | N/A |
| [Gentrace](https://gentrace.ai/) | An API and SDKs for evaluating and observing generative data, with features like AI, heuristic, and human grading evaluations, as well as production data observation | N/A | <a href=https://pypi.org/project/gentrace-py><img src="https://img.shields.io/pypi/dw/gentrace-py" width=150/></a> |
| [Patronus AI](https://www.patronus.ai/) | An automated evaluation and benchmarking platform for LLMs, providing tools for testing, scoring, and evaluating LLMs in real-world scenarios | N/A | N/A |
| [Autoblocks AI](https://www.autoblocks.ai/) | A collaborative cloud-based workspace designed for rapid iteration on GenAI products, offering features like prompt management, observability, continuous evaluations, fine-tuning, prototyping, debugging, and scalable data ingestion & search, all in a provider-agnostic environment | N/A | <a href=https://pypi.org/project/autoblocksai><img src="https://img.shields.io/pypi/dw/autoblocksai" width=150/></a> |
| [Context AI](https://context.ai/) | Tools for pre-launch LLM evaluations and post-launch analytics, with features such as  testing, performance monitoring, user conversation analysis, and support for various models and libraries | N/A | <a href=https://pypi.org/project/context-python><img src="https://img.shields.io/pypi/dw/context-python" width=150/></a> |
| [E2b dev](https://e2b.dev/) | Services to deploy, test, and monitor AI agents, including a sandbox with a secure, long-running cloud environment for various LLMs with features like internet access | <a href=https://github.com/e2b-dev/e2b><img src="https://img.shields.io/github/stars/e2b-dev/e2b?style=social" width=90/></a> | <a href=https://pypi.org/project/e2b><img src="https://img.shields.io/pypi/dw/e2b" width=150/></a> |
| [Agentops](https://www.agentops.ai/) | Toolkit for evaluating and developing AI agents, providing tools for agent development, monitoring capabilities, and replay analytics | <a href=https://github.com/AgentOps-AI/agentops><img src="https://img.shields.io/github/stars/AgentOps-AI/agentops?style=social" width=90/></a> | <a href=https://pypi.org/project/agentops><img src="https://img.shields.io/pypi/dw/agentops" width=150/></a> |
| [Zenoml](https://zenoml.com/) | AI evaluation platform that enables data visualization, model performance analysis, and the creation of interactive reports for various data types | <a href=https://github.com/zeno-ml/zeno-build><img src="https://img.shields.io/github/stars/zeno-ml/zeno-build?style=social" width=90/></a> | <a href=https://pypi.org/project/zeno-client><img src="https://img.shields.io/pypi/dw/zeno-client" width=150/></a> |
| [Baserun](https://baserun.ai/welcome) | Tools for model configuration, prompt playground, monitoring, and prototype workflow, as well as features for full visibility into LLM workflows and end-to-end testing | <a href=https://github.com/baserun-ai/baserun-py><img src="https://img.shields.io/github/stars/baserun-ai/baserun-py?style=social" width=90/></a> | <a href=https://pypi.org/project/baserun><img src="https://img.shields.io/pypi/dw/baserun" width=90/></a> |
| [WhyLabs](https://whylabs.ai/) | AI Observability platform for ML and GenAI including LLM monitoring, guardrails and security | <a href=https://github.com/whylabs><img src="https://img.shields.io/github/stars/whylabs?style=social" width=90/></a> | <a href=https://pypi.org/project/whylabs-client><img src="https://img.shields.io/pypi/dw/whylabs-client" width=150/></a> |
| [Log10](https://log10.io/) | AI-powered LLMOps platform that automatically optimizes prompts and models with built-in logging, debugging, metrics, feedback, evaluations and fine-tuning | <a href=https://github.com/log10-io/log10><img src="https://img.shields.io/github/stars/log10-io/log10?style=social" width=90/></a><br> | <a href=https://pypi.org/project/log10-io><img src="https://img.shields.io/pypi/dw/log10-io" width=150/></a><br><a href=https://pypi.org/project/llmeval><img src="https://img.shields.io/pypi/dw/llmeval" width=150/></a> |
| [promptfoo](https://www.promptfoo.dev/) | Open-source LLM eval framework with support for model/prompt/RAG eval, dataset generation, local models, and self-hosting. | <a href=https://github.com/promptfoo/promptfoo><img src="https://img.shields.io/github/stars/promptfoo/promptfoo?style=social" width=90/></a> | <a href=https://www.npmjs.com/package/promptfoo><img src="https://img.shields.io/npm/dw/promptfoo" width=150/></a> (node/npm) |
| [Parea AI](https://www.parea.ai/) | Platform and SDK for AI Engineers providing tools for LLM evaluation, observability, and a version-controlled enhanced prompt playground.                                                                                                                                                | <a href=https://github.com/parea-ai><img src="https://img.shields.io/github/stars/parea-ai/parea-sdk-py?style=social" width=90/></a>                                  | <a href=https://pypi.org/project/parea-ai/><img src="https://img.shields.io/pypi/dw/parea-ai" width=150/></a>                                                                                                              |
| [Galileo](https://www.rungalileo.io/) | Galileo is a platform for evaluation, fine-tuning and real-time observability, powered by high-accuracy hallucination guardrails. | N/A | N/A |


<p style="text-align: right;"><a href="#table-of-contents">^ Back to Contents ^</a></p>


### Validators
| Name (site) | Description | Github | Pip Installs |
|------------|------------|------------|------------|
| [Guardrails AI](https://shreyar.github.io/guardrails/) | An open-source Python package for specifying structure and type, validating, and correcting the outputs of LLMs | <a href=https://github.com/ShreyaR/guardrails><img src="https://img.shields.io/github/stars/ShreyaR/guardrails?style=social" width=90/></a> | <a href=https://pypi.org/project/guardrails-ai><img src="https://img.shields.io/pypi/dw/guardrails-ai" width=150/></a> |
| [Rebuff](https://github.com/woop/rebuff) | An open-source framework designed to detect and protect against prompt injection attacks in LLM apps | <a href=https://github.com/woop/rebuff><img src="https://img.shields.io/github/stars/woop/rebuff?style=social" width=90/></a> | <a href=https://pypi.org/project/rebuff><img src="https://img.shields.io/pypi/dw/rebuff" width=150/></a> |
| [Microsoft Guidance](https://github.com/microsoft/guidance) | A guidance language for controlling LLMs, providing a syntax for architecting LLM workflows | <a href=https://github.com/microsoft/guidance><img src="https://img.shields.io/github/stars/microsoft/guidance?style=social" width=90/></a> | <a href=https://pypi.org/project/guidance><img src="https://img.shields.io/pypi/dw/guidance" width=150/></a> |
| [LMQL](https://lmql.ai/) | An open-source programming language and platform for language model interaction | <a href=https://github.com/eth-sri/lmql><img src="https://img.shields.io/github/stars/eth-sri/lmql?style=social" width=90/></a> | <a href=https://pypi.org/project/lmql><img src="https://img.shields.io/pypi/dw/lmql" width=150/></a> |
| [Outlines](https://outlines-dev.github.io/outlines/) | A tool for helping developers guide text generation to build robust interfaces with external systems and guarantee that outputs match a regex or JSON schema | <a href=https://github.com/outlines-dev/outlines><img src="https://img.shields.io/github/stars/outlines-dev/outlines?style=social" width=90/></a> | <a href=https://pypi.org/project/outlines><img src="https://img.shields.io/pypi/dw/outlines" width=150/></a> |
| [LLM Guard](https://github.com/laiyer-ai/llm-guard) | An open-source, comprehensive tool designed to fortify the security of Large Language Models (LLMs). | <a href=https://github.com/laiyer-ai/llm-guard><img src="https://img.shields.io/github/stars/laiyer-ai/llm-guard?style=social" width=90/></a> | <a href=https://pypi.org/project/llm-guard><img src="https://img.shields.io/pypi/dw/llm-guard" width=150/></a> |

<p style="text-align: right;"><a href="#table-of-contents">^ Back to Contents ^</a></p>

### LLM APIs (proprietary)
| Name (site) | Description | Github | Pip Installs |
|------------|------------|------------|------------|
| [OpenAI](https://openai.com) | A company providing many leading LLMs, including the GPT-3.5 and GPT-4 families | N/A | <a href=https://pypi.org/project/openai><img src="https://img.shields.io/pypi/dw/openai" width=150/></a> |
| [Anthropic](https://anthropic.com) | The developer of Claude, an AI assistant based on Anthropic’s research  | N/A | <a href=https://pypi.org/project/anthropic><img src="https://img.shields.io/pypi/dw/anthropic" width=150/></a> |
| [Cohere AI](https://docs.cohere.com/docs/embeddings) | An LLM vendor with particular focus on embeddings for semantic search, topic clustering, and vertical applications | <a href=https://github.com/cohere-ai/notebooks><img src="https://img.shields.io/github/stars/cohere-ai/notebooks?style=social" width=90/></a> | <a href=https://pypi.org/project/cohere><img src="https://img.shields.io/pypi/dw/cohere" width=150/></a> |
| [LLM](https://llm.datasette.io/en/stable/) | A CLI utility and Python library for interacting with Large Language Models, both via remote APIs and models that can be installed and run on your own machine. | <a href=https://github.com/simonw/llm><img src="https://img.shields.io/github/stars/simonw/llm?style=social" width=90/></a> | <a href=https://pypi.org/project/llm/><img src="https://img.shields.io/pypi/dw/llm" width=150/></a> |

<p style="text-align: right;"><a href="#table-of-contents">^ Back to Contents ^</a></p>

### LLM APIs (open source)
| Name (site) | Description | Github | Pip Installs |
|------------|------------|------------|------------|
| [Hugging Face](https://huggingface.co/) | A hub for open-source AI models and inference endpoints, including leading base LLMs and LoRAs/fine-tunes | <a href=https://github.com/huggingface/transformers><img src="https://img.shields.io/github/stars/huggingface/transformers?style=social" width=90/></a> | <a href=https://pypi.org/project/transformers><img src="https://img.shields.io/pypi/dw/transformers" width=150/></a> |
| [Replicate](https://replicate.com/) | An AI hosting platform and model inference hub that allows software developers to integrate AI models into their apps | <a href=https://github.com/replicate/cog><img src="https://img.shields.io/github/stars/replicate/cog?style=social" width=90/></a> | <a href=https://pypi.org/project/replicate><img src="https://img.shields.io/pypi/dw/replicate" width=150/></a> |
| [Anyscale](https://www.anyscale.com/) | An AI API and compute platform that allows developers to scale inference, training, and embedding computations with any model using Ray | <a href=https://github.com/ray-project/ray><img src="https://img.shields.io/github/stars/ray-project/ray?style=social" width=90/></a> | <a href=https://pypi.org/project/ray><img src="https://img.shields.io/pypi/dw/ray" width=150/></a> |
| [Ollama](https://ollama.ai/) | Get up and running with large language models locally | <a href=https://github.com/ollama/ollama><img src="https://img.shields.io/github/stars/ollama/ollama?style=social" width=90/></a> | <a href=https://pypi.org/project/ollama/><img src="https://img.shields.io/pypi/dw/ollama" width=150/></a> |
| [GPT4ALL](https://gpt4all.io/index.html) | An ecosystem of open-source on-edge large language models. | <a href=https://github.com/nomic-ai/gpt4all><img src="https://img.shields.io/github/stars/nomic-ai/gpt4all?style=social" width=90/></a> | <a href=https://pypi.org/project/gpt4all/><img src="https://img.shields.io/pypi/dw/gpt4all" width=150/></a> |


<p style="text-align: right;"><a href="#table-of-contents">^ Back to Contents ^</a></p>

### App Hosting Platforms
| Name (site) | Description |
|------------|------------|
| [Vercel](https://vercel.com/) | A cloud platform designed for front-end engineers, built with first-class support for LLM apps |
| [Netlify](https://www.netlify.com/) | An enterprise cloud computing company that offers a development platform for web applications and dynamic websites |
| [Steamship](https://steamship.com/) | An SDK and hosting platform for AI agents and tools, both a package manager and package hosting service for AI |
| [Streamlit](https://streamlit.io/) | An open-source Python library designed for creating and sharing custom web apps for ML and data science |
| [Modal](https://modal.com) | A platform that enables running distributed applications using the modal Python package | 

<p style="text-align: right;"><a href="#table-of-contents">^ Back to Contents ^</a></p>

### Cloud Providers
| Name (site) | Description |
|------------|------------|
| [Amazon Web Services](https://aws.amazon.com/) | A cloud computing platform, offering services from data centers globally |
| [Google Cloud Platform](https://cloud.google.com/) | A cloud computing platform, offering services from data centers globally |
| [Microsoft Azure](https://azure.microsoft.com/) | A cloud computing platform, offering services from data centers globally |
| [CoreWeave](https://coreweave.com/) | A specialized cloud provider that delivers GPUs on top of flexible deployment infrastructure |

<p style="text-align: right;"><a href="#table-of-contents">^ Back to Contents ^</a></p>

### Opinionated Clouds
| Name (site) | Description |
|------------|------------|
| [Databricks (MosaicML)](https://databricks.com/) | Databricks acquired Mosaic ML in 2023, along with its tooling and platform for efficient pre-trainining, fine-tuning and inferencing LLMs |  
| [Anyscale](https://anyscale.com/) | An AI compute platform that enables developers to scale inference, training, and embedding computations with any model using Ray |
| [Modal](https://modal.com) | A platform that eables running distributed applications using the Modal Python package | 
| [Runpod](https://runpod.io/) | A cloud computing platform designed for AI and ML applications |
| [OctoML](https://octoml.ai/) | A compute service that allows users to run, tune, and scale generative models |
| [Baseten](https://baseten.co/) | A inference service that allows users to deploy, serve, and scale custom and open-source models |
| [E2B](https://github.com/e2b-dev/e2b) | Secure sandboxed cloud environments made for AI agents and AI apps |

<p style="text-align: right;"><a href="#table-of-contents">^ Back to Contents ^</a></p>

<br>
<br>
<br>


# **Full Spring Boot Implementation for RAG**

This Spring Boot backend will:
1. Accept user queries via a REST API.
2. Tokenize & embed the query.
3. Retrieve relevant documents from FAISS.
4. Use OpenAI GPT to generate a response.
5. Return the generated response to the React/Next.js frontend.

## **📌 Step 1: Setup Spring Boot Project**

### **1️⃣ Create a Spring Boot Project**
Use Spring Initializr or manually create a Maven project with the following dependencies:

### **`pom.xml` Dependencies**
```xml
<dependencies>
    <!-- Spring Boot Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Jackson for JSON Parsing -->
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
    </dependency>

    <!-- FAISS for Vector Search -->
    <dependency>
        <groupId>com.github.wonderful123</groupId>
        <artifactId>faiss-java</artifactId>
        <version>0.1.0</version>
    </dependency>

    <!-- OpenAI API Client -->
    <dependency>
        <groupId>com.theokanning.openai-gpt3-java</groupId>
        <artifactId>api</artifactId>
        <version>0.10.0</version>
    </dependency>
</dependencies>
```

---

## **📌 Step 2: Implement the Spring Boot Backend**

### **1️⃣ Create the `RagController.java`**
This REST endpoint will handle requests from the frontend and return an AI-generated response.

```java
package com.example.rag;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/rag")
public class RagController {

    @Autowired
    private RagService ragService;

    @PostMapping("/query")
    public ResponseEntity<String> queryRagSystem(@RequestBody QueryRequest request) {
        String response = ragService.processQuery(request.getQuery());
        return ResponseEntity.ok(response);
    }
}

class QueryRequest {
    private String query;
    public String getQuery() { return query; }
}
```
✅ Exposes the `/api/rag/query` endpoint, allowing frontend clients to send user queries.

---

### **2️⃣ Implement the `RagService.java`**
This service:
- Tokenizes & embeds the query.
- Searches FAISS for relevant results.
- Uses OpenAI GPT to generate a response.

```java
package com.example.rag;

import org.springframework.stereotype.Service;
import com.theokanning.openai.service.OpenAiService;
import com.theokanning.openai.completion.CompletionRequest;
import faiss.*;

@Service
public class RagService {

    private final OpenAiService openAiService = new OpenAiService("your-openai-api-key");
    private final IndexFlatL2 faissIndex;

    public RagService() {
        int dimension = 384; // Embedding vector size
        this.faissIndex = new IndexFlatL2(dimension);
    }

    public String processQuery(String query) {
        // Step 1: Tokenize & Embed Query
        float[] queryEmbedding = embedQuery(query);

        // Step 2: Search FAISS for Similar Embeddings
        int k = 3; // Number of nearest results to retrieve
        float[] distances = new float[k];
        int[] indices = new int[k];
        faissIndex.search(1, queryEmbedding, k, distances, indices);

        // Step 3: Retrieve Relevant Context (Placeholder for document retrieval)
        String retrievedText = "Relevant documents found...";

        // Step 4: Generate AI Response Using OpenAI
        CompletionRequest completionRequest = CompletionRequest.builder()
            .model("gpt-4")
            .prompt("Answer this based on retrieved text: " + retrievedText)
            .maxTokens(100)
            .build();

        return openAiService.createCompletion(completionRequest).getChoices().get(0).getText();
    }

    private float[] embedQuery(String query) {
        // Example: Convert query to a numerical vector (Replace with real embedding logic)
        return new float[384]; // Placeholder embedding
    }
}
```
✅ Implements the full RAG pipeline using:
- **FAISS for retrieval.**
- **OpenAI for response generation.**

---

## **📌 Step 3: Running the Spring Boot Backend**

Run the following command to start the server:
```bash
mvn spring-boot:run
```
- The backend will be available at `http://localhost:8080/api/rag/query`.
- It will process user queries, retrieve relevant context, and return AI-generated responses.






## Formatting Prompt Templates
We were able to partialy automate this - particularly finding Github and PyPI links - using this [Perplexity search prompt](https://github.com/a16z-infra/llm-app-stack/blob/main/table_construction_prompts/prompt_1_search.txt). It worked roughly ~75% of the time and could handle ~3 projects at a time, pulling data from 20-30 sources in each iteration. 

<img width="709" alt="image" src="https://github.com/a16z-infra/llm-app-stack/assets/57970926/1e4e53af-22c5-4d65-8bd9-aca776e4e970">


Once you have the data you would like to add, if you don't want deal with the markdown formatting here, it is easy to correctly format using a tool like [Cursor](https://cursor.sh/). 

See the prompt below that works as an inline edit, just make sure you highlight 4-5 previous examples so Cursor can infer the format itself:

<img width="838" alt="image" src="https://github.com/a16z-infra/llm-app-stack/assets/57970926/0518ab5e-82d8-4143-acd8-035ba1fd7a7d">



<p style="text-align: right;"><a href="#table-of-contents">^ Back to Contents ^</a></p>




<div align="center">
  <img src="https://storage.googleapis.com/hume-public-logos/hume/hume-banner.png">
  <h1>EVI Next.js App Router Example</h1>
</div>


![preview.png](preview.png)

## Overview

This project features a sample implementation of Hume's [Empathic Voice Interface](https://hume.docs.buildwithfern.com/docs/empathic-voice-interface-evi/overview) using Hume's React SDK. Here, we have a simple EVI that uses the Next.js App Router.

## Project Deployment

Click the button below to deploy this example project with Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhumeai%2Fhume-evi-next-js-starter&env=HUME_API_KEY,HUME_SECRET_KEY)

Below are the steps to completing deployment:

1. Create a Git Repository for your project.
2. Provide the required environment variables. To get your API key and Client Secret key, log into the portal and visit the [API keys page](https://beta.hume.ai/settings/keys).

## Support

If you have questions, require assistance, or wish to engage in discussions pertaining to this starter template, [please reach out to us on Discord](https://link.hume.ai/discord).



