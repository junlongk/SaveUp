# Use base image with Maven & Java
FROM maven:3.8.5-openjdk-17 AS builder

# Copy source code & pom.xml file
COPY src /home/app/src
COPY pom.xml /home/app

# Build the package
RUN mvn -f /home/app/pom.xml clean package -DskipTests

# Use base image with Java
FROM openjdk:17-oracle

# Copy the built JAR file
COPY --from=builder /home/app/target/server-0.0.1-SNAPSHOT.jar /usr/local/lib/server.jar

# Expose Spring Boot's port
EXPOSE 8080

# Execute the commands to start the server
ENTRYPOINT ["java", "-jar", "/usr/local/lib/server.jar"]