import { useAuthToken } from "@/hooks";
import { Collapsible } from "@components/ui";
import { NavigationItem } from "./navigation-item";
import { useQueryClient } from "@tanstack/react-query";
import { Banknote, Bike, Car, LogOut, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";


export const Navigation = () => {
  const { t } = useTranslation("navigation");

  const queryClient = useQueryClient();
  const { authToken, removeAuthToken } = useAuthToken();
  
  if (!authToken) return;

  return (
    <ul className="space-y-2">
      <li>
        <Collapsible
          header={
            <NavigationItem
              to="/transactions"
              title={t("transactions")}
              Icon={Banknote}
            />
          }
        >
          <ul>
            <li>
              <NavigationItem
                to="/categories"
                title={t("categories")}
              />
            </li>
      
            <li>
              <NavigationItem
                to="/paymentMethods"
                title={t("paymentMethods")}
              />
            </li>

            <li>
              <NavigationItem
                to="/accounts"
                title={t("bankAccounts")}
              />
            </li>
          </ul>
        </Collapsible>
      </li>
      
      <li>
        <NavigationItem
          to="/vehicles"
          title={t("vehicles")}
          Icon={Car}
        />
      </li>

      <li>
        <NavigationItem
          to="/sports"
          title={t("sports")}
          Icon={Bike}
        />
      </li>
      
      <li>
        <NavigationItem
          to="/settings"
          title={t("settings")}
          Icon={Settings}
        />
      </li>

      <li>
        <NavigationItem
          to="/login"
          additionalAction={() => {
            removeAuthToken();
            queryClient.clear();
          }}
          title={t("logout")}
          Icon={LogOut}
        /> 
      </li>
    </ul>
  )
}
