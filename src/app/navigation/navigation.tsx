import { useAuthToken, useLocalStorage } from "@shared/hooks";
import { Collapsible } from "@ui";
import { useTranslation } from "react-i18next";
import { NavigationItem } from "./navigation-item";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@context/navigation-context";
import { Banknote, Bike, Car, LogOut, Settings } from "lucide-react";


// when more collapsibles in navigation think about some more dynamic solution
const IS_TRANSACTIONS_COLLAPSIBLE_INITIALLY_OPEN_KEY =
  "is-transactions-collapsible-initially-open-key";

export const Navigation = () => {
  const { t } = useTranslation("navigation");

  const queryClient = useQueryClient();
  const { authToken, removeAuthToken } = useAuthToken();
  const { fromLeft } = useNavigation();

  const {
    item: isCollapsibleInitiallyOpen,
    setItem: setIsCollapsibleInitiallyOpen,
  } = useLocalStorage<boolean>(IS_TRANSACTIONS_COLLAPSIBLE_INITIALLY_OPEN_KEY, false);
  


  if (!authToken) return;

  return (
    
    <ul className="text-md md:text-lg">
      <li>
        <Collapsible
          header={
            <NavigationItem
              to="/transactions"
              title={t("transactions")}
              Icon={Banknote}
              additionalAction={() => setIsCollapsibleInitiallyOpen(false)}  
            />
          }
          indicatorPosition={fromLeft ? "left" : "right"}
          isInitiallyOpen={isCollapsibleInitiallyOpen!}
        >
          <ul>
            <li>
              <NavigationItem 
                to="/categories"
                title={t("categories")}
                additionalAction={() => setIsCollapsibleInitiallyOpen(true)}
              /></li>
            <li>
              <NavigationItem
                to="/paymentMethods"
                title={t("paymentMethods")}
                additionalAction={() => setIsCollapsibleInitiallyOpen(true)}
              />
            </li>
            <li>
              <NavigationItem
                to="/accounts"
                title={t("bankAccounts")}
                additionalAction={() => setIsCollapsibleInitiallyOpen(true)}  
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
          additionalAction={() => setIsCollapsibleInitiallyOpen(false)}
        />
        </li>
      <li>
        <NavigationItem
          to="/sports"
          title={t("sports")}
          Icon={Bike}
          additionalAction={() => setIsCollapsibleInitiallyOpen(false)}
        />
      </li>
      <li>
        <NavigationItem
          to="/settings"
          title={t("settings")}
          Icon={Settings}
          additionalAction={() => setIsCollapsibleInitiallyOpen(false)}
        />
      </li>
      <li>
        <NavigationItem
          to="/login"
          additionalAction={() => {
            removeAuthToken();
            queryClient.clear();
            setIsCollapsibleInitiallyOpen(false);
          }}
          title={t("logout")}
          Icon={LogOut}
        /> 
      </li>
    </ul>
  )
}
