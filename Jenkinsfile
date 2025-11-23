pipeline {
    agent any

    stages {
        stage('Build React App') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t dhanushgubba/react-frontend:latest .'
            }
        }

        stage('Push to DockerHub') {
            steps {
                withCredentials([string(credentialsId: 'docker-password', variable: 'DOCKER_PASSWORD')]) {
                    sh '''
                      echo "$DOCKER_PASSWORD" | docker login -u dhanushgubba --password-stdin
                      docker push dhanushgubba/react-frontend:latest
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh '''
                      ssh -o StrictHostKeyChecking=no ubuntu@EC2_IP_ADDRESS '
                        docker pull dhanushgubba/react-frontend:latest &&
                        docker stop react-frontend || true &&
                        docker rm react-frontend || true &&
                        docker run -d --name react-frontend -p 3000:80 dhanushgubba/react-frontend:latest
                      '
                    '''
                }
            }
        }
    }
}
