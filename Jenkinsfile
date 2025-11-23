pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'dhanushgubba'
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/dhanushgubba/Ecommerce-CICD.git'
            }
        }

        stage('Install & Build') {
            steps {
                sh '''
                npm install
                npm run build
                '''
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t frontend:latest .'
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub-pass', variable: 'DOCKER_PASSWORD')]) {
                    sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKERHUB_USER --password-stdin'
                }
                sh 'docker tag frontend:latest $DOCKERHUB_USER/frontend:latest'
                sh 'docker push $DOCKERHUB_USER/frontend:latest'
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ubuntu@3.108.194.180 "
                        docker pull $DOCKERHUB_USER/frontend:latest &&
                        docker stop frontend || true &&
                        docker rm frontend || true &&
                        docker run -d -p 80:80 --name frontend $DOCKERHUB_USER/frontend:latest
                    "
                    '''
                }
            }
        }
    }
}
