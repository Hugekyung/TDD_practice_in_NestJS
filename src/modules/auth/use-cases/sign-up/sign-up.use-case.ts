export class SignUpUseCase {
    constructor() {}

    validatePassword(password: string): boolean {
        if (password.length < 8 || password.length > 20) {
            throw new Error('11006');
        }

        return true;
    }

    // todo 2: 이메일 중복 검증
    // * 일주일 이내 탈퇴한 계정 => 11002
    // * 탈퇴한지 7 이후, 30일 이내인 경우 => 개인정보 파기
    // * 동일한 이메일 존재 => 11004
}
