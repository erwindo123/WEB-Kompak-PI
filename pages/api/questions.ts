import type { NextApiRequest, NextApiResponse } from "next";
import soal from "../../data/soal.json";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Mengirim semua soal ke frontend
  res.status(200).json(soal);
}
