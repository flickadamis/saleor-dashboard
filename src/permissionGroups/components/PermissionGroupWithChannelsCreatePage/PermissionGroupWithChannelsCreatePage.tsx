import AccountPermissions from "@dashboard/components/AccountPermissions";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { Backlink } from "@dashboard/components/Backlink";
import { ChannelPermission } from "@dashboard/components/ChannelPermission";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Savebar from "@dashboard/components/Savebar";
import {
  ChannelFragment,
  PermissionEnum,
  PermissionGroupErrorFragment,
} from "@dashboard/graphql";
import { FormChange, SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { buttonMessages, sectionNames } from "@dashboard/intl";
import { permissionGroupListUrl } from "@dashboard/permissionGroups/urls";
import { getFormErrors } from "@dashboard/utils/errors";
import getPermissionGroupErrorMessage from "@dashboard/utils/errors/permissionGroups";
import { Box } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

import PermissionGroupInfo from "../PermissionGroupInfo";
import { PermissionWithChannelsData } from "../PermissonGroupWithChannelsDetailsPage";

export interface PermissionGroupWithChannelsCreateFormData {
  name: string;
  hasFullAccess: boolean;
  hasAllChannels: boolean;
  isActive: boolean;
  permissions: PermissionEnum[];
  channels: string[];
}

const initialForm: PermissionGroupWithChannelsCreateFormData = {
  hasFullAccess: false,
  hasAllChannels: true,
  isActive: false,
  name: "",
  permissions: [],
  channels: [],
};

export interface PermissionGroupWithChannelsCreatePageProps {
  disabled: boolean;
  errors: PermissionGroupErrorFragment[];
  permissions: PermissionWithChannelsData[];
  channels: ChannelFragment[];
  hasRestrictedChannels: boolean;
  saveButtonBarState: "loading" | "success" | "error" | "default";
  onSubmit: (data: PermissionGroupWithChannelsCreateFormData) => SubmitPromise;
}

export const PermissionGroupWithChannelsCreatePage: React.FC<
  PermissionGroupWithChannelsCreatePageProps
> = ({
  disabled,
  permissions,
  channels,
  onSubmit,
  saveButtonBarState,
  hasRestrictedChannels,
  errors,
}) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const formErrors = getFormErrors(["addPermissions"], errors || []);
  const permissionsError = getPermissionGroupErrorMessage(
    formErrors.addPermissions,
    intl,
  );

  return (
    <Form
      confirmLeave
      initial={{
        ...initialForm,
        hasAllChannels: !hasRestrictedChannels,
      }}
      onSubmit={onSubmit}
      disabled={disabled}
    >
      {({ data, change, submit, isSaveDisabled }) => {
        const handleChannelChange: FormChange = event => {
          change({
            target: {
              name: "channels",
              value: event.target.value,
            },
          });
        };

        const handleHasAllChannelsChange = () => {
          change({
            target: {
              name: "hasAllChannels",
              value: !data.hasAllChannels,
            },
          });
        };

        return (
          <DetailPageLayout>
            <TopNav title="New Permission Group" />
            <DetailPageLayout.Content>
              <Backlink href={permissionGroupListUrl()}>
                {intl.formatMessage(sectionNames.permissionGroups)}
              </Backlink>
              <PermissionGroupInfo
                data={data}
                errors={errors}
                onChange={change}
                disabled={disabled}
              />
            </DetailPageLayout.Content>
            <DetailPageLayout.RightSidebar>
              <Box display="flex" flexDirection="column" height="100%">
                <Box overflow="hidden" __maxHeight="50%">
                  <AccountPermissions
                    permissionsExceeded={false}
                    data={data}
                    errorMessage={permissionsError}
                    disabled={disabled}
                    permissions={permissions}
                    onChange={change}
                    fullAccessLabel={intl.formatMessage(
                      buttonMessages.selectAll,
                    )}
                    description={intl.formatMessage({
                      id: "CYZse9",
                      defaultMessage:
                        "Expand or restrict group's permissions to access certain part of saleor system.",
                      description: "card description",
                    })}
                  />
                </Box>
                <Box overflow="hidden" __maxHeight="50%" height="100%">
                  <ChannelPermission
                    allChannels={channels}
                    selectedChannels={data.channels}
                    onChannelChange={handleChannelChange}
                    onHasAllChannelsChange={handleHasAllChannelsChange}
                    hasAllChannels={data.hasAllChannels}
                    disabled={false}
                    disabledSelectAllChannels={hasRestrictedChannels}
                  />
                </Box>
              </Box>
            </DetailPageLayout.RightSidebar>
            <Savebar
              onCancel={() => navigate(permissionGroupListUrl())}
              onSubmit={submit}
              state={saveButtonBarState}
              disabled={isSaveDisabled}
            />
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};