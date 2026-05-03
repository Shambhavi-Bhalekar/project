pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID = credentials('AWS_ACCOUNT_ID')
        AWS_REGION = 'us-east-2'
        ECR_AUTH_REPO = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/auth-service"
        ECR_POSTS_REPO = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/posts-service"
        ECR_FRONTEND_REPO = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/frontend"
        // SONAR_HOST_URL = credentials('SONAR_HOST_URL')
        // SONAR_TOKEN = credentials('sonar-token')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Unit Tests') {
            parallel {
                stage('Auth Service Tests') {
                    steps {
                        dir('auth-service') {
                            sh '''
                            pip3 install -r requirements.txt
                            pip3 install pytest httpx
                            # pytest
                            '''
                        }
                    }
                }
                stage('Posts Service Tests') {
                    steps {
                        dir('posts-service') {
                            sh '''
                            pip3 install -r requirements.txt
                            pip3 install pytest httpx
                            # pytest
                            '''
                        }
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('Sonarqube') {
                    sh 'sonar-scanner -Dsonar.projectKey=blog-app -Dsonar.sources=.'
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build & Push Docker Images') {
            steps {
                script {
                    sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
                    
                    dir('auth-service') {
                        def authImage = docker.build("${ECR_AUTH_REPO}:${env.BUILD_ID}")
                        authImage.push()
                        authImage.push('latest')
                    }
                    
                    dir('posts-service') {
                        def postsImage = docker.build("${ECR_POSTS_REPO}:${env.BUILD_ID}")
                        postsImage.push()
                        postsImage.push('latest')
                    }
                    
                    // Frontend Dockerfile is at the repo root
                    def feImage = docker.build("${ECR_FRONTEND_REPO}:${env.BUILD_ID}", ".")
                    feImage.push()
                    feImage.push('latest')
                }
            }
        }

        stage('Update K8s Manifests') {
            steps {
                sh """
                sed -i 's|image: .*auth-service:latest|image: ${ECR_AUTH_REPO}:${env.BUILD_ID}|g' k8s/auth.yaml
                sed -i 's|image: .*posts-service:latest|image: ${ECR_POSTS_REPO}:${env.BUILD_ID}|g' k8s/posts.yaml
                sed -i 's|image: .*frontend:latest|image: ${ECR_FRONTEND_REPO}:${env.BUILD_ID}|g' k8s/frontend.yaml
                """
            }
        }
stage('Create K8s Secret') {
  steps {
    withCredentials([
      file(credentialsId: 'KUBECONFIG', variable: 'KUBECONFIG'),
      string(credentialsId: 'SUPABASE_URL', variable: 'SUPABASE_URL'),
      string(credentialsId: 'SUPABASE_KEY', variable: 'SUPABASE_KEY'),
      string(credentialsId: 'JWT_SECRET', variable: 'JWT_SECRET')
    ]) {
      sh '''
        export KUBECONFIG=$KUBECONFIG

        echo "Checking cluster connection..."
        kubectl get nodes

        kubectl create namespace app --dry-run=client -o yaml | kubectl apply -f -

        kubectl create secret generic app-secrets \
          --from-literal=SUPABASE_URL=$SUPABASE_URL \
          --from-literal=SUPABASE_KEY=$SUPABASE_KEY \
          --from-literal=JWT_SECRET=$JWT_SECRET \
          -n app \
          --dry-run=client -o yaml | kubectl apply -f -
      '''
    }
  }
}
        stage('Deploy via Ansible') {
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: 'EC2_SSH_KEY', keyFileVariable: 'SSH_KEY'),
                    string(credentialsId: 'SUPABASE_URL',   variable: 'SUPABASE_URL'),
                    string(credentialsId: 'SUPABASE_KEY',   variable: 'SUPABASE_KEY'),
                    string(credentialsId: 'JWT_SECRET',      variable: 'JWT_SECRET'),
                    string(credentialsId: 'K8S_MASTER_IP',  variable: 'K8S_MASTER_IP')
                ]) {
                    sh '''
                    export ANSIBLE_HOST_KEY_CHECKING=False
                    export SUPABASE_URL=$SUPABASE_URL
                    export SUPABASE_KEY=$SUPABASE_KEY
                    export JWT_SECRET=$JWT_SECRET
                    export K8S_MASTER_IP=$K8S_MASTER_IP
                    ansible-playbook -i ansible/inventory.ini ansible/playbook.yml \
                        --private-key $SSH_KEY \
                        -e "ansible_ssh_common_args='-o StrictHostKeyChecking=no'"
                    '''
                }
            }
        }
    }
}
