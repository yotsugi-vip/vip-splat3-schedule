interface splat3api {
    "results": {
        "regular": matches[],
        "bankara_challenge": matches[],
        "bankara_open": matches[],
        "x": matches[],
        "fest": []
    }
}

interface matches {
    "start_time": string,
    "end_time": string,
    "rule": {
        "key": string,
        "name": string
    },
    "stages": stages[],
    "is_fest": boolean
}

interface festMatch {
    "start_time": string,
    "end_time": string,
    "rule": {
        "key": string,
        "name": string
    },
    "stages": stages[],
    "is_fest": boolean,
    "is_tricolor": boolean,
    "tricolor_stage": {
        "name": string,
        "image": string
    }
}

interface stages {
    "id": number,
    "name": string,
    "image": string
}