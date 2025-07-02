pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing dependencies...'
                sh 'npm ci'
            }
        }

        stage('Build Project') {
            steps {
                echo '⚙️ Building project...'
                sh 'npm run build'
            }
        }

        stage('Deploy to Nginx') {
            steps {
                echo '🚀 Deploying to Nginx...'

                // Clear existing files
                sh 'sudo rm -rf /var/www/html/*'

                // Copy new build to Nginx folder
                sh 'sudo cp -r dist/* /var/www/html/'

                // Restart Nginx to apply changes
                echo '🔄 Restarting Nginx...'
                sh 'sudo systemctl restart nginx'
            }
        }
    }

    post {
        success {
            echo '✅ Deployment completed successfully!'
        }
        failure {
            echo '❌ Deployment failed.'
        }
    }
}
