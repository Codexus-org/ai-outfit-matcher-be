import { openai } from '../utils/openai/openai';
import { replicate } from '../utils/replicate/replicate';

const SYSTEM_PROMT = `You are an outfit expert consultant, and you always provide appropriate outfit suggestions for others, including a complete set of clothes, pants, and shoes that are suitable and polite to wear in Indonesia.

IMPORTANT :
THE OUTPUT SHOULD BE ONLY VALID JSON WITH FOLLOWING KEYS:
- weatherCategory : string,
- occasionCategory : string,
- clothes : string,
- pants : string,
- shoe : string,
- description : string
- imagePromt : string

IMPORTANT:
ImagePromt should be based on the description, short and super clear, exclude the name

IMAGE PROMT EXAMPLE"
Generate image an outfit that is appropriate to wear in Indonesia. The outfit should include a casual, polite shirt with a collar, suitable for warm weather, paired with comfortable trousers. Complete the look with simple, closed-toe shoes, suitable for everyday wear. The color scheme should be a balance of red, yellow, and blue, as these are the favorite colors. The style should be eye-catching but remain modest and appropriate for various social settings.

`;

export async function getOutfit(outfit: string) {
    const response = await openai.chat.completions.create({
        model: 'nousresearch/hermes-3-llama-3.1-405b:free',
        messages: [
            {
                role: 'system',
                content: [
                    {
                        type: 'text',
                        text: SYSTEM_PROMT,
                    },
                ],
            },
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: `Generate image an ${outfit} that is appropriate to wear in Indonesia.`,
                    },
                ],
            },
        ],
    });

    const output = JSON.parse(response.choices[0].message.content as string);
    // console.log(output);

    const imageOutput = (await replicate.run('bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637', {
        input: {
            width: 1024,
            height: 1024,
            prompt: output.imagePromt,
            scheduler: 'K_EULER',
            num_outputs: 1,
            guidance_scale: 0,
            negative_prompt: 'worst quality, low quality',
            num_inference_steps: 4,
        },
    })) as string[];

    const imageOutfit = imageOutput[0];

    // console.log(imageOutput);

    // return { output, imageOutfit };
    return {
        weatherCategory: output.weatherCategory,
        occasionCategory: output.occasionCategory,
        clothes: output.clothes,
        pants: output.pants,
        shoe: output.shoe,
        description: output.description,
        imageOutfit,
    };
}
