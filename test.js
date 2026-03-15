import { supabase } from './supabaseClient.js';

async function checkConnection() { 

    const { data, error } = await supabase
        .from('profiles')    
        .select('*')
        .limit(1);

    if (error) {
        console.error('❌ فشل الاتصال:', error.message);
    } else {
        console.log('✅ تم الاتصال بنجاح! البيانات المستلمة:', data);
    }
}

checkConnection();