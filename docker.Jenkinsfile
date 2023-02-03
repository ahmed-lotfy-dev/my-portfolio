pipeline {
  environment {
    imagename = "alotfy2019/my-portofolio"
    registryCredential = 'dockerhub'
    dockerImage = ''
  }
  agent any
  stages {
    stage('Cloning Git') {
      steps {
        git([url: 'https://github.com/ahmed-lotfy-dev/my-portfolio', branch: 'main', credentialsId: 'dockerhub'])

      }
    }
    stage('Building image') {
      steps{
        script {
          dockerImage = docker.build my-portofolio
        }
      }
    }
    stage('Deploy Image') {
      steps{
        script {
          docker.withRegistry( '', registryCredential ) {
            dockerImage.push("$BUILD_NUMBER")
            dockerImage.push('latest')

          }
        }
      }
    }
    stage('Remove Unused docker image') {
      steps{
        sh "docker rmi $my-portofolio:$BUILD_NUMBER"
        sh "docker rmi $my-portofolio:latest"

      }
    }
  }
}