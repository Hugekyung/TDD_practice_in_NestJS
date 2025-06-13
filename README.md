# TDD 작성 연습 프로젝트

- 기존에 작성했던 로직을 TDD 방식으로 재 작성해보는 연습

## 어떻게 작성할 것인가

### 1. UseCase 클래스 활용

- AuthService 클래스에서는 Facade처럼 각 기능을 수행하는 메서드들의 조합으로 로직 흐름 구현
- 각 기능 단위 메서드 구현은 UseCase 클래스에서 구현
- UseCase 클래스의 각 메서드는 단위 테스트 방식으로 구현

### 2. spyOn, mockResolvedValue 활용

### 3. Mock 객체 활용
