module.exports = {
  project: {
    ios: {
      // CLI의 자동 pod install이 ReactCodegen 스크립트 경로를 잘못 생성해
      // 빌드가 깨지므로 비활성화. 네이티브 의존성 변경 시
      // `cd ios && bundle exec pod install`을 직접 실행할 것.
      automaticPodsInstallation: false,
    },
  },
};
