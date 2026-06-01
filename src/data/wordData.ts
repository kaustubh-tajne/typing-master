// Word categories for standard paragraph generation
export const subjects = [
  "developer", "engineer", "student", "application", "database",
  "server", "system", "algorithm", "architect", "pipeline",
  "framework", "platform", "interface", "module", "component"
];

export const verbs = [
  "creates", "builds", "optimizes", "deploys", "analyzes",
  "designs", "improves", "manages", "processes", "monitors",
  "integrates", "validates", "transforms", "scales", "maintains"
];

export const adjectives = [
  "scalable", "efficient", "robust", "modern", "distributed",
  "reliable", "secure", "performant", "flexible", "lightweight",
  "powerful", "dynamic", "intelligent", "automated", "reactive"
];

export const objects = [
  "microservices", "cloud infrastructure", "distributed systems",
  "web applications", "software products", "backend services",
  "data pipelines", "REST endpoints", "message queues",
  "container clusters", "cache layers", "event streams",
  "API gateways", "service meshes", "observability tools"
];

export const adverbs = [
  "efficiently", "reliably", "seamlessly", "automatically",
  "dynamically", "consistently", "rapidly", "securely"
];

// Developer mode word pool
export const devWords = [
  "Java", "Spring Boot", "React", "TypeScript", "Docker",
  "Kubernetes", "PostgreSQL", "Redis", "Kafka", "Microservices",
  "REST API", "Authentication", "JWT", "Cloud Computing", "GraphQL",
  "Node.js", "Python", "Go", "Rust", "Terraform", "CI/CD",
  "Git", "Linux", "Nginx", "MongoDB", "Elasticsearch", "RabbitMQ",
  "WebSocket", "gRPC", "Prometheus", "Grafana", "Helm", "Ansible",
  "Lambda", "S3", "EC2", "VPC", "IAM", "Cloudfront", "DynamoDB",
  "Celery", "FastAPI", "Next.js", "Vite", "Webpack", "Babel",
  "ESLint", "Jest", "Cypress", "Storybook", "Figma", "Postman"
];

export const devSentenceTemplates = [
  "{A} applications commonly expose {B}.",
  "{A} containers simplify deployment workflows.",
  "{A} improves application performance through caching.",
  "{A} enables horizontal scaling of {B}.",
  "{A} provides type safety across the codebase.",
  "{A} orchestrates containerized {B} at scale.",
  "Teams use {A} to stream real-time {B}.",
  "{A} secures API endpoints with token-based auth.",
  "Engineers rely on {A} for robust {B}.",
  "{A} accelerates development of {B}.",
  "Modern {B} architectures leverage {A} for reliability.",
  "The {A} pipeline automates testing and {B}.",
];
