pipeline {
    agent any

    tools {
        nodejs 'NodeJS 20'
    }

    environment {
        JIRA_BASE_URL = 'https://cesizenstestelin.atlassian.net'
        JIRA_PROJECT_KEY = 'CZM'
    }

    stages {
        stage('Install') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                sh 'npm ci'
            }
        }

        stage('Security Audit') {
            steps {
                sh 'npm audit --audit-level=high'
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
            echo 'Pipeline CESIZen Front en échec. Création d’un ticket Jira...'

            withCredentials([
                usernamePassword(
                    credentialsId: 'jira-api',
                    usernameVariable: 'JIRA_USER',
                    passwordVariable: 'JIRA_TOKEN'
                )
            ]) {
                sh '''
                    trap 'rm -f jira-payload.json' EXIT

                    cat > jira-payload.json <<EOF
{
  "fields": {
    "project": {
      "key": "${JIRA_PROJECT_KEY}"
    },
    "summary": "[CI FRONT] Échec du pipeline Jenkins #${BUILD_NUMBER}",
    "issuetype": {
      "name": "Incident"
    },
    "description": {
      "type": "doc",
      "version": 1,
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Le pipeline Jenkins ${JOB_NAME} a échoué."
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Build : #${BUILD_NUMBER}"
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "URL Jenkins : ${BUILD_URL}"
            }
          ]
        }
      ]
    }
  }
}
EOF

                    curl --silent \
                         --show-error \
                         --fail-with-body \
                         --user "$JIRA_USER:$JIRA_TOKEN" \
                         --request POST \
                         --header "Accept: application/json" \
                         --header "Content-Type: application/json" \
                         --data @jira-payload.json \
                         "${JIRA_BASE_URL}/rest/api/3/issue"
                '''
            }
        }
    }
}
