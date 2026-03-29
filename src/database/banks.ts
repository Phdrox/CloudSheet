import { db } from '../database/db.js'; // Seu arquivo de configuração do Drizzle
import { banks } from '../database/schemas.js';
import axios from 'axios';

async function seedBanks() {
  console.log('⏳ Buscando dados da Brasil API...');

  try {
    const { data: apiBanks } = await axios.get('https://brasilapi.com.br/api/banks/v1');

    console.log(`🚀 Processando ${apiBanks.length} bancos no banco de dados...`);

    for (const bank of apiBanks) {
      // Dica: Montando a URL da logo de um repo público se o banco tiver código COMPE
      const logoUrl = bank.code 
        ? `https://raw.githubusercontent.com/matheusfelipeog/brazilian-banks/master/logos/${String(bank.code).padStart(3, '0')}.png`
        : null;

      await db.insert(banks)
        .values({
          ispb: bank.ispb,
          name: bank.fullName || bank.name,
          compeCode: bank.code ? String(bank.code) : null,
          logoUrl: logoUrl,
        })
        .onConflictDoUpdate({
          target: banks.ispb, // Se o ISPB já existir...
          set: {
            name: bank.fullName || bank.name,
            compeCode: bank.code ? String(bank.code) : null,
            logoUrl: logoUrl,
          },
        });
    }

    console.log('✅ Sincronização concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro no seed:', error);
  }
}

seedBanks();