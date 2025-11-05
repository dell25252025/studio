"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { api } from "@/trpc/react";
import { type RouterOutputs } from "@/trpc/shared";
import { useEffect, useState } from "react";
import { DateRangePicker } from "@/components/ui/date-range-picker";

import { Globe, Instagram, Send, Twitter } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const profileFormSchema = z.object({
  bio: z
    .string()
    .max(160, {
      message: "La biographie ne doit pas dépasser 160 caractères.",
    })
    .optional(),
  dateOfBirth: z.date().optional(),
  // TODO: add profile picture
  // profileImage: z.string().url().optional(),
  name: z
    .string()
    .min(2, {
      message: "Le nom doit comporter au moins 2 caractères.",
    })
    .max(30, {
      message: "Le nom ne doit pas dépasser 30 caractères.",
    }),
  gender: z.enum(["male", "female", "other"]).optional(),
  // TODO: add interests
  // interests: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  // TODO: add location
  // location: z.string().optional(),
  // TODO: add social links
  socialLinks: z
    .object({
      instagram: z.string().optional(),
      twitter: z.string().optional(),
      website: z.string().optional(),
    })
    .optional(),
  travelIntentions: z
    .array(z.enum(["sponsor", "sponsored", "50_50", "flexible"]))
    .optional(),
  travelDates: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
  // TODO: fix this
  // isVerified: z.boolean().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type EditProfileClientProps = {
  user: RouterOutputs["user"]["get"];
};

export default function EditProfileClient({
  user: initialUser,
}: EditProfileClientProps) {
  const utils = api.useUtils();
  const [user, setUser] = useState(initialUser);

  const { mutate, isLoading } = api.user.update.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Profil mis à jour",
        description: "Votre profil a été mis à jour avec succès.",
      });
      // Update user in state
      setUser(data);
      utils.user.get.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description:
          "Une erreur s'est produite lors de la mise à jour de votre profil.",
      });
      console.error(error);
    },
  });

  const defaultValues: Partial<ProfileFormValues> = {
    name: user.name ?? "",
    bio: user.bio ?? "",
    gender: user.gender ?? undefined,
    travelIntentions: (user.travelIntentions as any) ?? [],
    travelDates: user.travelDates ?? undefined,
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    mutate(data);
  }

  const [areDatesFlexible, setAreDatesFlexible] = useState(
    defaultValues.travelIntentions?.includes("flexible")
  );

  useEffect(() => {
    if (areDatesFlexible) {
      form.setValue("travelDates", undefined);
    }
  }, [areDatesFlexible]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Dell" {...field} />
              </FormControl>
              <FormDescription>
                Ceci est votre nom d'affichage public. Il peut s'agir de votre vrai
                nom ou d'un pseudonyme.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Parlez-nous un peu de vous"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Vous pouvez <span>@mentionner</span> d'autres utilisateurs et organisations pour
                créer un lien.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="socialLinks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Réseaux sociaux</FormLabel>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Instagram />
                  <Input
                    placeholder="Instagram"
                    onChange={(e) =>
                      field.onChange({
                        ...field.value,
                        instagram: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Twitter />
                  <Input
                    placeholder="Twitter"
                    onChange={(e) =>
                      field.onChange({ ...field.value, twitter: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Globe />
                  <Input
                    placeholder="Website"
                    onChange={(e) =>
                      field.onChange({ ...field.value, website: e.target.value })
                    }
                  />
                </div>
              </div>
              <FormDescription>
                Liez vos réseaux sociaux pour permettre aux autres de mieux vous
                connaître.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="travelIntentions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intentions de voyage</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={
                      field.value?.includes("sponsor") ? "default" : "secondary"
                    }
                    onClick={() => {
                      const newValue = field.value?.includes("sponsor")
                        ? field.value?.filter((v) => v !== "sponsor")
                        : [...(field.value ?? []), "sponsor"];
                      field.onChange(newValue);
                    }}
                  >
                    Sponsor
                  </Badge>
                  <Badge
                    variant={
                      field.value?.includes("sponsored")
                        ? "default"
                        : "secondary"
                    }
                    onClick={() => {
                      const newValue = field.value?.includes("sponsored")
                        ? field.value?.filter((v) => v !== "sponsored")
                        : [...(field.value ?? []), "sponsored"];
                      field.onChange(newValue);
                    }}
                  >
                    Sponsorisé
                  </Badge>
                  <Badge
                    variant={
                      field.value?.includes("50_50") ? "default" : "secondary"
                    }
                    onClick={() => {
                      const newValue = field.value?.includes("50_50")
                        ? field.value?.filter((v) => v !== "50_50")
                        : [...(field.value ?? []), "50_50"];
                      field.onChange(newValue);
                    }}
                  >
                    50/50
                  </Badge>
                </div>
              </FormControl>
              <FormDescription>
                Sélectionnez vos intentions de voyage.
              </FormDescription>
              <div className="flex items-center space-x-2 pt-4">
                <Checkbox
                  id="flexible-dates"
                  checked={areDatesFlexible}
                  onCheckedChange={(checked) => {
                    setAreDatesFlexible(!!checked);
                    const newValue = checked
                      ? [...(field.value ?? []), "flexible"]
                      : field.value?.filter((v) => v !== "flexible");
                    field.onChange(newValue);
                  }}
                />
                <label
                  htmlFor="flexible-dates"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Mes dates sont flexibles
                </label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="travelDates"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dates de voyage</FormLabel>
              <FormControl>
                <DateRangePicker
                  date={field.value ?? { from: undefined, to: undefined }}
                  onDateChange={field.onChange}
                  disabled={areDatesFlexible}
                />
              </FormControl>
              <FormDescription>
                Sélectionnez vos dates de voyage.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" isLoading={isLoading}>
          <Send className="mr-2" />
          Mettre à jour le profil
        </Button>
      </form>
    </Form>
  );
}
