
'use server';

/**
 * @fileOverview This file implements the AI-powered matching flow for the Travel with Me application.
 *
 * It uses Genkit to analyze user profiles and travel intentions to suggest compatible travel partners.
 *
 * - aiPoweredMatching - A function that takes a user profile and returns a list of suggested travel partners.
 * - AIPoweredMatchingInput - The input type for the aiPoweredMatching function.
 * - AIPoweredMatchingOutput - The return type for the aiPoweredMatching function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const languageBenefitTool = ai.defineTool(
  {
    name: 'languageBenefit',
    description: 'Determines if knowing a certain language provides a benefit in a specific country.',
    inputSchema: z.object({
      language: z.string().describe('The language to check.'),
      country: z.string().describe('The country to check for language benefit.'),
    }),
    outputSchema: z.object({
      benefit: z.boolean().describe('True if the language provides a significant benefit, false otherwise.'),
      reason: z.string().describe('A brief explanation for the benefit (e.g., "Official language", "Widely spoken in tourist areas").'),
    }),
  },
  async ({ language, country }) => {
    // In a real application, this could be an API call to a knowledge base or a more complex logic.
    // For this prototype, we'll use a simple hardcoded logic.
    const languageCountryMap: Record<string, string[]> = {
      'French': ['France', 'Monaco', 'Belgium'],
      'Spanish': ['Spain', 'Mexico', 'Colombia', 'Argentina', 'Peru', 'Ecuador'],
      'Italian': ['Italy'],
      'Greek': ['Greece'],
      'English': ['USA', 'UK', 'Australia', 'New Zealand', 'Canada'],
      'Dutch': ['Netherlands'],
    };
    
    const isBeneficial = (languageCountryMap[language] || []).includes(country);

    return {
      benefit: isBeneficial,
      reason: isBeneficial ? `Spoken in ${country}` : `Not a primary language in ${country}`,
    };
  }
);


const AIPoweredMatchingInputSchema = z.object({
  userProfile: z.object({
    travelStyle: z.string().describe('The user travel style (e.g., Luxe, Adventure, Backpacking).'),
    dreamDestinations: z.array(z.string()).describe('A list of the user dream destinations.'),
    languagesSpoken: z.array(z.string()).describe('A list of languages the user speaks.'),
    travelIntention: z
      .enum(['Sponsor', 'Sponsorisé', '50/50', 'Groupe'])
      .describe('The user travel intention.'),
    interests: z.array(z.string()).describe('A list of the user interests.'),
    age: z.number().describe('The user age.'),
    sex: z.enum(['Homme', 'Femme', 'Non-binaire', 'Male', 'Female', 'Other']).describe('The user sex.'),
    verified: z.boolean().describe('Whether the user profile is verified.'),
  }).describe('The user profile.'),
  possibleMatches: z.array(z.object({
    travelStyle: z.string().describe('The travel style of the possible match (e.g., Luxe, Adventure, Backpacking).'),
    dreamDestinations: z.array(z.string()).describe('A list of the possible match dream destinations.'),
    languagesSpoken: z.array(z.string()).describe('A list of languages the possible match speaks.'),
    travelIntention: z
       .enum(['Sponsor', 'Sponsorisé', '50/50', 'Groupe'])
      .describe('The possible match travel intention.'),
    interests: z.array(z.string()).describe('A list of the possible match interests.'),
    age: z.number().describe('The possible match age.'),
    sex: z.enum(['Homme', 'Femme', 'Non-binaire', 'Male', 'Female', 'Other']).describe('The possible match sex.'),
    verified: z.boolean().describe('Whether the possible match profile is verified.'),
  })).describe('An array of possible travel matches.'),
});

export type AIPoweredMatchingInput = z.infer<typeof AIPoweredMatchingInputSchema>;

const AIPoweredMatchingOutputSchema = z.array(z.object({
  matchIndex: z.number().describe('The index of the matched user in the possibleMatches array'),
  compatibilityScore: z.number().describe('A score indicating how well the user matches with the possible match.'),
  reason: z.string().describe('The reason why the possible match is compatible.'),
}));

export type AIPoweredMatchingOutput = z.infer<typeof AIPoweredMatchingOutputSchema>;

export async function aiPoweredMatching(input: AIPoweredMatchingInput): Promise<AIPoweredMatchingOutput> {
  return aiPoweredMatchingFlow(input);
}

const matchingPrompt = ai.definePrompt({
  name: 'matchingPrompt',
  tools: [languageBenefitTool],
  input: {schema: AIPoweredMatchingInputSchema},
  output: {schema: AIPoweredMatchingOutputSchema},
  prompt: `You are a travel agent specializing in matching travel partners based on their profiles and travel intentions. Review the user profile and possible matches and generate an array of the best matches based on compatibility.

User Profile:
Travel Style: {{{userProfile.travelStyle}}}
Dream Destinations: {{#each userProfile.dreamDestinations}}{{{this}}}, {{/each}}
Languages Spoken: {{#each userProfile.languagesSpoken}}{{{this}}}, {{/each}}
Travel Intention: {{{userProfile.travelIntention}}}
Interests: {{#each userProfile.interests}}{{{this}}}, {{/each}}
Age: {{{userProfile.age}}}
Sex: {{{userProfile.sex}}}
Verified: {{{userProfile.verified}}}

Possible Matches:
{{#each possibleMatches}}
Match {{@index}}:
Travel Style: {{{this.travelStyle}}}
Dream Destinations: {{#each this.dreamDestinations}}{{{this}}}, {{/each}}
Languages Spoken: {{#each this.languagesSpoken}}{{{this}}}, {{/each}}
Travel Intention: {{{this.travelIntention}}}
Interests: {{#each this.interests}}{{{this}}}, {{/each}}
Age: {{{this.age}}}
Sex: {{{this.sex}}}
Verified: {{{this.verified}}}
{{/each}}

Consider the following when determining compatibility:
- Shared travel styles and interests
- Overlapping dream destinations
- Compatibility of travel intentions (e.g., a "Sponsor" matching with a "Sponsorisé" user)
- Use the languageBenefit tool to determine if a match's language skills offer a practical advantage in any of the user's dream destinations. Highlight this as a key compatibility factor if a benefit is found.
- Age and sex preferences
- Verified profiles
- Make sure to include the match index from the possibleMatches array in the output

Output the best matches:
`, 
});


const aiPoweredMatchingFlow = ai.defineFlow(
  {
    name: 'aiPoweredMatchingFlow',
    inputSchema: AIPoweredMatchingInputSchema,
    outputSchema: AIPoweredMatchingOutputSchema,
  },
  async input => {
    const {output} = await matchingPrompt(input);
    return output!;
  }
);
