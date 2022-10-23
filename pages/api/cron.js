export default function test() {

}
async function getSchedule(isPuv = true) {
    const splat3Endpoint = "";
    const testEndpoint = "https://httpbin.org";
    const header = new Headers([
        ['method', 'get'],
        ['User-Agent', 'twitter@ytg-vip']
    ]);

    const response = await fetch(isPuv ? splat3Endpoint : testEndpoint, header);

    if (response.status === "200") {
        //json保存
        //json解析
        //画像キャッシュ処理
        //スケジュール画像生成
    } else {
        console.log('develop mode');
    }
}