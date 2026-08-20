import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

import { useLoginMutation } from "@/app-runtime/app-runtime";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";
import { useTranslation } from "@/hooks/localization/useTranslation";
import { resolveAuthErrorMessage } from "@core/auth/adapters/presentation/auth-error-message";

/** Values owned by the email and password login form. */
interface LoginFormValues {
  /** Account email entered by the user. */
  email: string;
  /** Password entered by the user. */
  password: string;
}

const EMAIL_LABEL_ID = "login-email-label";
const EMAIL_ERROR_ID = "login-email-error";
const PASSWORD_LABEL_ID = "login-password-label";
const PASSWORD_ERROR_ID = "login-password-error";

/** Submits the login use-case and presents safe localized failures. */
export function LoginForm() {
  const { t } = useTranslation();
  const [login, { isLoading }] = useLoginMutation();
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /** Submits canonical credentials through the auth context API. */
  async function handleSubmitLogin(values: LoginFormValues) {
    try {
      await login({
        email: values.email.trim(),
        password: values.password,
      }).unwrap();
    } catch (error) {
      setError("root", {
        message: resolveAuthErrorMessage(error, t, {
          action: "login",
          fallbackMessage: t("auth__login__error__unexpected"),
        }),
      });
    }
  }

  /** Runs form validation before dispatching the login mutation. */
  function handlePressLogin() {
    handleSubmit(handleSubmitLogin)();
  }

  return (
    <View className="gap-5">
      <Controller
        control={control}
        name="email"
        rules={{
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: t("auth__login__email_invalid"),
          },
          required: t("auth__login__email_required"),
        }}
        render={({ field: { onBlur, onChange, ref, value } }) => (
          <View className="gap-2">
            <Text nativeID={EMAIL_LABEL_ID} variant="small">
              {t("auth__login__email_label")}
            </Text>
            <Input
              ref={ref}
              aria-describedby={
                errors.email?.message ? EMAIL_ERROR_ID : undefined
              }
              aria-invalid={Boolean(errors.email)}
              aria-labelledby={EMAIL_LABEL_ID}
              accessibilityHint={errors.email?.message}
              accessibilityLabel={t("auth__login__email_label")}
              accessibilityLabelledBy={EMAIL_LABEL_ID}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              editable={!isLoading}
              keyboardType="email-address"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={t("auth__login__email_placeholder")}
              textContentType="emailAddress"
              value={value}
            />
            {errors.email?.message ? (
              <Text
                accessibilityLiveRegion="polite"
                accessibilityRole="alert"
                className="text-destructive"
                nativeID={EMAIL_ERROR_ID}
                variant="muted"
              >
                {errors.email.message}
              </Text>
            ) : null}
          </View>
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{ required: t("auth__login__password_required") }}
        render={({ field: { onBlur, onChange, ref, value } }) => (
          <View className="gap-2">
            <Text nativeID={PASSWORD_LABEL_ID} variant="small">
              {t("auth__login__password_label")}
            </Text>
            <Input
              ref={ref}
              aria-describedby={
                errors.password?.message ? PASSWORD_ERROR_ID : undefined
              }
              aria-invalid={Boolean(errors.password)}
              aria-labelledby={PASSWORD_LABEL_ID}
              accessibilityHint={errors.password?.message}
              accessibilityLabel={t("auth__login__password_label")}
              accessibilityLabelledBy={PASSWORD_LABEL_ID}
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect={false}
              editable={!isLoading}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={t("auth__login__password_placeholder")}
              secureTextEntry
              textContentType="password"
              value={value}
            />
            {errors.password?.message ? (
              <Text
                accessibilityLiveRegion="polite"
                accessibilityRole="alert"
                className="text-destructive"
                nativeID={PASSWORD_ERROR_ID}
                variant="muted"
              >
                {errors.password.message}
              </Text>
            ) : null}
          </View>
        )}
      />

      {errors.root?.message ? (
        <Text
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
          className="text-destructive"
          variant="muted"
        >
          {errors.root.message}
        </Text>
      ) : null}

      <Button
        accessibilityState={{ busy: isLoading, disabled: isLoading }}
        disabled={isLoading}
        onPress={handlePressLogin}
      >
        <Text>
          {isLoading ? t("auth__login__submitting") : t("auth__login__submit")}
        </Text>
      </Button>
    </View>
  );
}
