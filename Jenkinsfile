pipeline {
    agent any

    tools {
        nodejs 'NodeJS 20'
    }

    stages {
        stage('Install') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                sh 'npm ci'
            }
        }

        stage('Tests') {
            steps {
                sh 'npm test -- --watch=false'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }

    post {
        success {
            archiveArtifacts artifacts: 'dist/**/*',
                             fingerprint: true

            echo 'Pipeline CESIZen Front réussi.'
        }

        failure {
            echo 'Pipeline CESIZen Front en échec.'
        }
    }
}
