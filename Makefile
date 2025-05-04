SERVICES := afs-combined-service client-service invoice-service project-service task-service ticket-service ui

IMAGE_PREFIX := abhirambsn/indie-desk

build-%:
	@echo "Building Docker image for $*"
	docker buildx build --platform linux/amd64,linux/arm64 --push -f modules/$*/Dockerfile -t $(IMAGE_PREFIX)-$*:latest .

build-all: $(addprefix build-,$(SERVICES))
	@echo "Building all Docker images"

deploy-local:
	@echo "Deploying all services locally"
	docker-compose -f docker-compose.yaml up -d
	@echo "All services deployed locally"