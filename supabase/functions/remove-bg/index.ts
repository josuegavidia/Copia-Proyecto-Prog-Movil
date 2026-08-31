// Supabase Edge Function: remove-bg
// Deno TypeScript Serverless Endpoint for Background Removal

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { image_base64, image_url } = await req.json();

    if (!image_base64 && !image_url) {
      return new Response(
        JSON.stringify({ error: 'No se proporcionó imagen para procesar.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const SERVER_API_KEY = Deno.env.get('REMOVE_BG_API_KEY') || Deno.env.get('CLIPDROP_API_KEY');

    if (SERVER_API_KEY) {
      const formData = new FormData();
      if (image_base64) {
        formData.append('image_file_b64', image_base64);
      } else if (image_url) {
        formData.append('image_url', image_url);
      }
      formData.append('size', 'auto');
      formData.append('format', 'png');

      const apiRes = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': SERVER_API_KEY,
        },
        body: formData,
      });

      if (apiRes.ok) {
        const arrayBuf = await apiRes.arrayBuffer();
        const base64Png = btoa(String.fromCharCode(...new Uint8Array(arrayBuf)));
        const dataUri = `data:image/png;base64,${base64Png}`;

        return new Response(
          JSON.stringify({ success: true, result_uri: dataUri }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Fallback: HuggingFace RMBG-1.4 Open Source Serverless Endpoint
    const hfToken = Deno.env.get('HF_ACCESS_TOKEN');
    if (hfToken) {
      let imageBuffer: ArrayBuffer;
      if (image_base64) {
        const binStr = atob(image_base64.replace(/^data:image\/\w+;base64,/, ''));
        const len = binStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binStr.charCodeAt(i);
        }
        imageBuffer = bytes.buffer;
      } else {
        const fetchRes = await fetch(image_url);
        imageBuffer = await fetchRes.arrayBuffer();
      }

      const hfRes = await fetch(
        'https://api-inference.huggingface.co/models/briaai/RMBG-1.4',
        {
          headers: { Authorization: `Bearer ${hfToken}` },
          method: 'POST',
          body: imageBuffer,
        }
      );

      if (hfRes.ok) {
        const resArrayBuf = await hfRes.arrayBuffer();
        const base64Png = btoa(String.fromCharCode(...new Uint8Array(resArrayBuf)));
        const dataUri = `data:image/png;base64,${base64Png}`;

        return new Response(
          JSON.stringify({ success: true, result_uri: dataUri }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // If server tokens not yet configured on Supabase dashboard
    return new Response(
      JSON.stringify({
        success: false,
        error: 'El backend de Supabase está conectado pero requiere configurar la clave de servidor REMOVE_BG_API_KEY o HF_ACCESS_TOKEN en los Secrets de Supabase.',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Error interno al procesar imagen.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
