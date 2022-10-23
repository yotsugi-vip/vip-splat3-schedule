import { NextApiRequest, NextApiResponse } from 'next';
import { makeSchedule } from './schedule';
import * as fs from 'fs';

/**
 * 
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */
export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { authorization } = req.headers;

            if (authorization === `Bearer ${process.env.API_SECRET_KEY}`) {
                await getSchedule();
                await makeSchedule();
                res.status(200).json({ success: true });
            } else {
                res.status(401).json({ success: false });
            }
        } catch (err) {
            res.status(500).json({ statusCode: 500, message: err.message });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}

async function getSchedule() {
    const splat3Endpoint = "https://spla3.yuu26.com/api/schedule";
    const header = new Headers([
        ['method', 'get'],
        ['User-Agent', 'twitter@ytg-vip']
    ]);

    const response = await fetch(splat3Endpoint, header);
    const data = await response.json();

    fs.writeFileSync('./public/schedule.json', JSON.stringify(data));
}