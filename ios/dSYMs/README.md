# iOS Archive용 프레임워크 dSYM

다운로드한 **실제 iPhone용 Release dSYM**을 아래 위치에 둡니다.
`.dSYM` 묶음은 내부 파일을 꺼내거나 이름을 바꾸지 말고 통째로 복사합니다.

```text
ios/dSYMs/
├── README.md
├── React.framework.dSYM/
├── ReactNativeDependencies.framework.dSYM/
└── hermesvm.framework.dSYM/
```

## 최초 준비

현재 프로젝트는 React Native 0.88.0, Hermes 260318099.0.4를 사용합니다.
[공식 React Native 0.88.0 릴리스 페이지](https://github.com/react/react-native/releases/tag/v0.88.0)
하단에서 다음 세 항목의 **Release** 링크를 다운로드하고 압축을 풉니다.

- ReactNative Core dSYMs: `ios-arm64` 안의 `React.framework.dSYM`
- ReactNativeDependencies dSYMs: `ios-arm64` 안의 `ReactNativeDependencies.framework.dSYM`
- Hermes V1 dSYMs: `iphoneos` 안의 `hermesvm.framework.dSYM`

다운로드별 상위 폴더 구조는 다를 수 있습니다. `ios-arm64` 또는 `iphoneos` 폴더
자체가 아니라 그 안의 위 세 `.dSYM` 묶음을 이 디렉터리에 복사합니다.
simulator, catalyst, tvOS, macOS, visionOS용 파일은 사용하지 않습니다.

## Archive 절차

1. 위 세 `.dSYM` 묶음을 준비합니다. 이미 다운로드했다면 다시 받을 필요는 없습니다.
2. Xcode에서 `ios/Renzzle_FE.xcworkspace`를 엽니다.
3. 실제 iOS 기기 또는 `Any iOS Device (arm64)`를 선택하고 **Product → Archive**를 실행합니다.
4. 앱 타깃의 **Copy Framework dSYMs** 단계가 앱에 포함된 세 프레임워크와 dSYM의
   UUID를 검사한 뒤 Archive에 복사합니다. 일반 Debug 빌드에서는 실행하지 않습니다.
5. Organizer에서 Archive의 **Show in Finder → 패키지 내용 보기 → dSYMs**를 열어
   기존 앱 dSYM과 위 세 프레임워크 dSYM이 있는지 확인하고 업로드합니다.

Build Phase는 이미 연결되어 있으므로 별도 추가나 `pod install`은 필요하지 않습니다.
누락 또는 UUID 불일치 시 Archive가 오류 메시지와 함께 중단됩니다.
다운로드한 올바른 심볼로 교체한 후 다시 Archive합니다.

## 버전 변경 및 다른 컴퓨터

React Native/Hermes를 업데이트하면 해당 릴리스의 Release dSYM을 다시 준비합니다.
React Native 버전은 `package.json`, 실제 Hermes 버전은 `ios/Podfile.lock`의
`hermes-engine` 항목에서 확인합니다. UUID가 일치하는 동안에는 같은 파일을 재사용합니다.

dSYM은 용량이 크므로 Git에서 제외했습니다. 다른 컴퓨터나 CI에서도 Archive 전에
동일한 위치에 세 묶음을 준비해야 합니다. `ios/Pods` 밖에 보관하므로 Pods를 다시
설치해도 이 파일들은 유지됩니다. 이미 만든 Archive는 이 설정으로 변경되지 않습니다.
