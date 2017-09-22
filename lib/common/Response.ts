export class Result {
    constructor(public name?: string, public content?: any) {

    }
}

export class Error {
    constructor(public code: number, public message: string) {

    }
}