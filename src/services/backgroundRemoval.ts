export const BackgroundRemovalService = {
  removeBackground: async (
    imageUri: string,
    base64Data?: string
  ): Promise<{ success: boolean; resultUri?: string; error?: string }> => {
    try {
      if (!base64Data && !imageUri) {
        return {
          success: false,
          error: 'No se ha seleccionado ninguna foto para procesar.',
        };
      }

      let cleanBase64 = base64Data
        ? base64Data.replace(/^data:image\/\w+;base64,/, '')
        : '';

      // If base64 was missing from memory, convert local URI on the fly
      if (!cleanBase64 && imageUri) {
        try {
          const res = await fetch(imageUri);
          const blob = await res.blob();
          const reader = new FileReader();
          const readPromise = new Promise<string>((resolve) => {
            reader.onloadend = () => {
              const fullBase64 = (reader.result as string) || '';
              resolve(fullBase64.replace(/^data:image\/\w+;base64,/, ''));
            };
            reader.onerror = () => resolve('');
            reader.readAsDataURL(blob);
          });
          cleanBase64 = await readPromise;
        } catch (e) {
          console.warn('Could not read imageUri to base64:', e);
        }
      }

      const apiKey =
        process.env.EXPO_PUBLIC_REMOVE_BG_KEY || 'zg94p4sYPNtztXVfRRMsWRMD';

      // 1. Remove.bg Official API with JSON Base64 Payload
      if (apiKey && cleanBase64) {
        try {
          const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
              'X-Api-Key': apiKey,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              image_file_b64: cleanBase64,
              size: 'auto',
              type: 'person',
              format: 'png',
            }),
          });

          if (response.ok) {
            const json = await response.json();
            if (json?.data?.result_b64) {
              const resultUri = `data:image/png;base64,${json.data.result_b64}`;
              return { success: true, resultUri };
            }
          } else {
            const errorJson = await response.json().catch(() => null);
            const errorMsg =
              errorJson?.errors?.[0]?.title ||
              errorJson?.errors?.[0]?.detail ||
              `Error ${response.status} de remove.bg`;
            return {
              success: false,
              error: `Remove.bg: ${errorMsg}`,
            };
          }
        } catch (apiErr: any) {
          console.warn('Network error calling remove.bg:', apiErr);
        }
      }

      return {
        success: false,
        error: 'No se pudo conectar con el servidor de remove.bg. Verifica tu conexión a internet.',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Error al procesar la eliminación de fondo.',
      };
    }
  },
};
