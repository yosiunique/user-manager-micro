pipeline {
    options {
        buildDiscarder(logRotator(numToKeepStr: '2'))
    }
    environment {
        DATE =  new Date().format('yy.M')
        TAG = "${DATE}.${BUILD_NUMBER}"
        PRODUCTION_SERVER_ADDRESS = "${PRODUCTION_SERVER_ADDRESS}"
        PRODUCTION_SERVER_USERNAME = "${PRODUCTION_SERVER_USERNAME}"
        TEST_SERVER_ADDRESS = "${TEST_SERVER_ADDRESS}"
        TEST_SERVER_USERNAME = "${TEST_SERVER_USERNAME}"
        DOCKER_PRIVATE_REGISTRY = "${DOCKER_PRIVATE_REGISTRY}"

    }
    agent any 
    stages {
       stage("Build Docker") {
            steps {
                script {
                    docker.build("registry:5000/loan-repayment-ui:${TAG}")
                }
            }
        }
        stage("Push Docker Image to Local Registry") {
            steps {
                script {
                    docker.withRegistry("http://registry:5000") {
                        docker.image("registry:5000/loan-repayment-ui:${TAG}").push()
                        docker.image("registry:5000/loan-repayment-ui:${TAG}").push("latest")
                    }
                }
            }
        }

        stage("Deliver for development") {
          
             when{
            branch ="develop"
        }

            steps {
                sshagent(['enat-remedy-development']) {
                    sh 'ssh -o StrictHostKeyChecking=no -l ${TEST_SERVER_USERNAME} ${TEST_SERVER_ADDRESS} "docker stop loan-repayment-ui | true; docker loan-repayment-ui | true; docker run -p 4510:80 -d --name loan-repayment-ui ${DOCKER_PRIVATE_REGISTRY}/ifb-financing-ui:${TAG}"'
                }
            }
        }
        stage("Deploy for production") {
            when {
                branch "main"
            }
            steps {
                sshagent(['enat-remedy-production']) {
                    sh 'ssh -o StrictHostKeyChecking=no -l ${PRODUCTION_SERVER_USERNAME} ${PRODUCTION_SERVER_ADDRESS} "docker stop loan-repayment-ui | true; docker rm loan-repayment-ui | true; docker run -p 4510:80 -d --name loan-repayment-ui ${DOCKER_PRIVATE_REGISTRY}/loan-repayment-ui:${TAG}"'
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
        failure {
            sh """
            curl -X POST -H "Content-Type: application/json" -d '{"value1":"${JOB_NAME}","value2":"${BUILD_NUMBER}","value3":"Failed"}' https://maker.ifttt.com/trigger/Build_Notification/with/key/c9HE9K84X22YKOKsCiNivz
            """
        }
        success {
            sh """
            curl -X POST -H "Content-Type: application/json" -d '{"value1":"${JOB_NAME}","value2":"${BUILD_NUMBER}","value3":"Successful"}' https://maker.ifttt.com/trigger/Build_Notification/with/key/c9HE9K84X22YKOKsCiNivz
            """
        }
    }
}

