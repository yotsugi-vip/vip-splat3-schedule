import { createCanvas, registerFont, Image, loadImage } from 'canvas';
import { createWriteStream, readFileSync, writeFileSync } from 'fs';
import { Headers } from 'node-fetch';
import fetch from 'node-fetch';
async function getSchedule() {
    const splat3Endpoint = "https://spla3.yuu26.com/api/schedule";
    const header = new Headers([
        ['method', 'get'],
        ['User-Agent', 'twitter@ytg-vip']
    ]);
    const response = await fetch(splat3Endpoint, { ...header });
    const data = await response.json();
    writeFileSync('./public/schedule.json', JSON.stringify(data));
}
async function makeImage() {
    const json_raw = readFileSync('./public/schedule.json');
    const schedule_json = JSON.parse(json_raw.toString());
    const canvas = await makeAllImg(schedule_json);
    const out = createWriteStream("./public/schedule.jpg");
    const stream = canvas.createJPEGStream();
    stream.pipe(out);
}
const makeAllImg = async (schedule_json) => {
    const one_schedule_h = 160;
    const all_schedule_h = one_schedule_h * schedule_json.result.bankara_challenge.length;
    const canvas = createCanvas(2240, all_schedule_h);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(await scheduleTimeImg(schedule_json), 0, 0);
    ctx.drawImage(await StageImg(schedule_json, "open"), 320, 0);
    ctx.drawImage(await StageImg(schedule_json, "challenge"), 960, 0);
    ctx.drawImage(await StageImg(schedule_json, "x"), 1600, 0);
    return canvas;
};
const scheduleTimeImg = async (schedule_json) => {
    // must call brefore create Canvas!!!!
    registerFont('./public/Koruri-20210720/Koruri-Regular.ttf', { family: 'kokuri_r' });
    registerFont('./public/Koruri-20210720/Koruri-Extrabold.ttf', { family: 'kokuri_exb' });
    const one_schedule_h = 160;
    const all_schedule_h = one_schedule_h * schedule_json.result.bankara_open.length;
    const canvas = createCanvas(320, all_schedule_h);
    const canvas_om = createCanvas(320, 160);
    const ctx = canvas.getContext('2d');
    const ctx_om = canvas_om.getContext('2d');
    let schedule_index = 0;
    for (const match of schedule_json.result.bankara_open) {
        const date = new Date(Date.parse(match.start_time));
        let start_tm;
        let start_date;
        ctx_om.fillStyle = schedule_index % 2 === 0 ? "rgb(169,169,169)" : "rgb(220,220,220)";
        ctx_om.fillRect(0, 0, 320, 180);
        // set start time
        const dayOfWeekStr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const year = date.getFullYear();
        const month = ('0' + `${date.getMonth() + 1}`).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const makedate = year + "/" + month + "/" + day + " " + dayOfWeekStr[date.getDay()];
        start_tm = ('0' + date.getHours()).slice(-2) + ":" + ('0' + date.getMinutes()).slice(-2) + "~";
        start_date = makedate;
        ctx_om.fillStyle = "rgb(0, 0, 0)";
        ctx_om.font = '30px "kokuri_exb"';
        ctx_om.fillText(start_date, 10, 40);
        ctx_om.font = '50px "kokuri_exb"';
        ctx_om.fillText(start_tm, 10, 120);
        console.log(match.start_time + "->" + start_date + ":" + start_tm);
        // draw output canvas
        ctx.drawImage(canvas_om, 0, one_schedule_h * schedule_index);
        schedule_index++;
    }
    return canvas;
};
const StageImg = async (schedule_json, rule) => {
    registerFont('./public/Koruri-20210720/Koruri-Regular.ttf', { family: 'kokuri_r' });
    registerFont('./public/Koruri-20210720/Koruri-Extrabold.ttf', { family: 'kokuri_exb' });
    const one_schedule_h = 160;
    const all_schedule_h = one_schedule_h * schedule_json.result.bankara_open.length;
    const canvas = createCanvas(640, all_schedule_h);
    const canvas_om = createCanvas(640, 160);
    const ctx = canvas.getContext('2d');
    const ctx_om = canvas_om.getContext('2d');
    const rule_size = 120;
    let schedule_index = 0;
    let imgbuff = new Image();
    const drawRule = rule === "open" ? schedule_json.result.bankara_open
        : rule === "challenge" ? schedule_json.result.bankara_challenge
            : rule === "x" ? schedule_json.result.x
                : schedule_json.result.regular;
    for (let i = 0; i < drawRule.length; i++) {
        let index = 0;
        ctx_om.fillStyle = schedule_index % 2 === 0 ? "rgb(169,169,169)" : "rgb(220,220,220)";
        ctx_om.fillRect(0, 0, 640 + 5, 160);
        // stage draw
        if (!drawRule[i].is_fest) {
            for (const stage of drawRule[i].stages) {
                const w = 640;
                const h = 320;
                const stage_cvs = createCanvas(w, h);
                const stg_ctx = stage_cvs.getContext('2d');
                imgbuff = await getStageImage(stage.id);
                stg_ctx.drawImage(imgbuff, 0, 0);
                stg_ctx.fillStyle = "rgba(50, 50, 50, 0.5)";
                stg_ctx.fillRect(0, h - 55, w, 55);
                stg_ctx.fillRect(0, 0, w, 80);
                stg_ctx.font = '50px "kokuri_exb';
                stg_ctx.fillStyle = "rgb(255, 255, 255)";
                stg_ctx.fillText(stage.name, 10, 310, 640);
                if (rule === "open")
                    stg_ctx.fillText("オープン", 10, 60);
                if (rule === "challenge")
                    stg_ctx.fillText("チャレンジ", 10, 60);
                if (rule === "x") {
                    stg_ctx.font = '60px "kokuri_exb';
                    stg_ctx.fillStyle = "rgb(255, 59, 0)";
                    stg_ctx.fillText("X", 10 + 3, 60 + 2);
                    stg_ctx.font = '50px "kokuri_exb';
                    stg_ctx.fillStyle = "rgb(255, 255, 255)";
                    stg_ctx.fillText("  マッチ", 10, 60);
                }
                imgbuff = await loadImage(`./public/asset/rule/${getRuleAsset(drawRule[i].rule.key)}`);
                stg_ctx.drawImage(imgbuff, w - rule_size - 5, 5, rule_size, rule_size);
                ctx_om.drawImage(clipCarveSq(stage_cvs), 315 * index + 7.5, 5, 310, 150);
                index++;
            }
        }
        else {
            if (rule === "open") {
                for (const stage of schedule_json.result.fest[i].stages) {
                    const w = 640;
                    const h = 320;
                    const stage_cvs = createCanvas(w, h);
                    const stg_ctx = stage_cvs.getContext('2d');
                    imgbuff = await getStageImage(stage.id);
                    stg_ctx.drawImage(imgbuff, 0, 0);
                    stg_ctx.fillStyle = "rgba(50, 50, 50, 0.5)";
                    stg_ctx.fillRect(0, h - 55, w, 55);
                    stg_ctx.fillRect(0, 0, w, 80);
                    stg_ctx.font = '50px "kokuri_exb';
                    stg_ctx.fillStyle = "rgb(255, 255, 255)";
                    stg_ctx.fillText(stage.name, 10, 310, 640);
                    stg_ctx.fillText("フェスマッチ", 10, 60);
                    imgbuff = await loadImage(`./public/asset/rule/fest.png`);
                    stg_ctx.drawImage(imgbuff, w - rule_size - 5, 5, rule_size, rule_size);
                    ctx_om.drawImage(clipCarveSq(stage_cvs), 315 * index + 7.5, 5, 310, 150);
                    index++;
                }
            }
            else if (schedule_json.result.fest[i].is_tricolor) {
                const w = 640;
                const h = 320;
                const stage_cvs = createCanvas(w, h);
                const stg_ctx = stage_cvs.getContext('2d');
                const get_stageID = ((name) => {
                    let ret = 0;
                    switch (name) {
                        case "ユノハナ大渓谷":
                            ret = 1;
                            break;
                        case "ゴンズイ地区":
                            ret = 2;
                            break;
                        case "ヤガラ市場":
                            ret = 3;
                            break;
                        case "マテガイ放水路":
                            ret = 4;
                            break;
                        case "ナメロウ金属":
                            ret = 6;
                            break;
                        case "クサヤ温泉":
                            ret = 7;
                            break;
                        case "タラポートショッピングパーク":
                            ret = 8;
                            break;
                        case "ヒラメが丘団地":
                            ret = 9;
                            break;
                        case "マサバ海峡大橋":
                            ret = 10;
                            break;
                        case "キンメダイ美術館":
                            ret = 11;
                            break;
                        case "マヒマヒリゾート＆スパ":
                            ret = 12;
                            break;
                        case "海女美術大学":
                            ret = 13;
                            break;
                        case "チョウザメ造船":
                            ret = 14;
                            break;
                        case "ザトウマーケット":
                            ret = 15;
                            break;
                        case "スメーシーワールド":
                            ret = 16;
                            break;
                        case "コンブトラック":
                            ret = 17;
                            break;
                        default:
                            ret = 1;
                            break;
                    }
                    return 0;
                });
                imgbuff = await getStageImage(get_stageID(schedule_json.result.fest[i].tricolor_stage.name));
                stg_ctx.drawImage(imgbuff, 0, 0);
                stg_ctx.fillStyle = "rgba(50, 50, 50, 0.5)";
                stg_ctx.fillRect(0, h - 55, w, 55);
                stg_ctx.fillRect(0, 0, w, 80);
                stg_ctx.font = '50px "kokuri_exb';
                stg_ctx.fillStyle = "rgb(255, 255, 255)";
                stg_ctx.fillText(schedule_json.result.fest[i].tricolor_stage.name, 10, 310, 640);
                stg_ctx.fillText("トリカラバトル", 10, 60);
                imgbuff = await loadImage(`./public/asset/rule/toricolor.png`);
                stg_ctx.drawImage(imgbuff, w - rule_size - 5, 5, rule_size, rule_size);
                ctx_om.drawImage(clipCarveSq(stage_cvs), 315 * 0 + 7.5, 5, 310, 150);
            }
            else {
                const w = 640;
                const h = 320;
                const stage_cvs = createCanvas(w, h);
                const stg_ctx = stage_cvs.getContext('2d');
                imgbuff = await getStageImage(0);
                stg_ctx.drawImage(imgbuff, 0, 0);
                stg_ctx.fillStyle = "rgba(50, 50, 50, 0.5)";
                stg_ctx.fillRect(0, h - 55, w, 55);
                stg_ctx.fillRect(0, 0, w, 80);
                stg_ctx.font = '50px "kokuri_exb';
                stg_ctx.fillStyle = "rgb(255, 255, 255)";
                stg_ctx.fillText("フェス開催中!", 10, 310, 640);
                stg_ctx.fillText("フェスマッチ", 10, 60);
                ctx_om.drawImage(clipCarveSq(stage_cvs), 315 * 0 + 7.5, 5, 310, 150);
                ctx_om.drawImage(clipCarveSq(stage_cvs), 315 * 1 + 7.5, 5, 310, 150);
            }
        }
        // draw output canvas
        ctx.drawImage(canvas_om, 0, 160 * schedule_index);
        schedule_index++;
    }
    return canvas;
};
const getStageImage = async (stage_id) => {
    let imgbuff = new Image();
    try {
        imgbuff = await loadImage('./public/asset/stage_vss/stage_' + ('0' + stage_id).slice(-2) + '.png');
    }
    catch {
        console.log(`error not fond statge image ID:${stage_id}`);
        imgbuff = await loadImage('./public/asset/stage_vss/stage_00.png');
    }
    return imgbuff;
};
const getRuleAsset = (rule) => {
    return rule === "AREA" ? "splatzones.png" :
        rule === "LOFT" ? "towercontroll.png" :
            rule === "GOAL" ? "rainmaker.png" :
                rule === "CLAM" ? "clamblitz.png" : "turfwar.png";
};
const clipCarveSq = (image) => {
    const canvas = createCanvas(640, 320);
    const ctx = canvas.getContext('2d');
    const w = 640;
    const h = 320;
    const r = 15;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(r, h - r, r, Math.PI, Math.PI * 0.5, true);
    ctx.arc(w - r, h - r, r, Math.PI * 0.5, 0, true);
    ctx.arc(w - r, r, r, 0, Math.PI * 1.5, true);
    ctx.arc(r, r, r, Math.PI * 1.5, Math.PI, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(image, 0, 0);
    return canvas;
};
export default async function makeSchedule() {
    await getSchedule();
    await makeImage();
}
makeSchedule();
