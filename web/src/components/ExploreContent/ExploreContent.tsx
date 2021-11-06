import { Form, Formik } from "formik";
import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";
import {
  useFindSuggestedChatRoomsLazyQuery,
  useFindUsersLazyQuery,
  useGetSuggestedChatRoomsQuery,
} from "../../generated/graphql";
import IconButton from "../IconButton/IconButton";
import InputField from "../InputField/InputField";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";
import SuggestedChatRoom from "../SuggestedChatRoom/SuggestedChatRoom";
import SuggestedUser from "../SuggestedUser/SuggestedUser";
import styles from "./ExploreContent.module.scss";

const ExploreContent: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const { data } = useGetSuggestedChatRoomsQuery();

  const [findUsers, { data: foundUsers, loading: usersLoading }] =
    useFindUsersLazyQuery();
  const [findChatRooms, { data: foundRooms, loading: roomsLoading }] =
    useFindSuggestedChatRoomsLazyQuery();

  return (
    <div className={styles.exploreContent}>
      <div className={styles.search}>
        <Formik
          initialValues={{ search: "" }}
          onSubmit={() => {
            if (search.length > 0) {
              findUsers({ variables: { search } });
              findChatRooms({ variables: { search } });
            }
          }}
        >
          <Form>
            <div className={styles.formik}>
              <InputField
                name="search"
                placeholder="search chat rooms and users"
                value={search}
                onChange={(e) => {
                  setSearch(e.currentTarget.value);
                }}
              />
              <IconButton
                Icon={BsSearch}
                type="submit"
                className={styles.searchButton}
              />
            </div>
          </Form>
        </Formik>
      </div>
      {roomsLoading || usersLoading ? (
        <div className={styles.loading}>
          <LoadingIndicator />
        </div>
      ) : (
        <div>
          {foundUsers && foundUsers.findUsers.length > 0 && (
            <>
              <h3>Users</h3>
              <div className={styles.suggestedChats}>
                {foundUsers.findUsers.map((elem, index) => (
                  <SuggestedUser userWithAvatar={elem} key={index} />
                ))}
              </div>
            </>
          )}

          {foundRooms && foundRooms.findSuggestedChatRooms.length > 0 && (
            <>
              <h3>chat rooms</h3>
              <div className={styles.suggestedChats}>
                {foundRooms.findSuggestedChatRooms.map((elem, index) => (
                  <SuggestedChatRoom chatRoomWithImage={elem} key={index} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
      {foundUsers &&
        foundUsers.findUsers.length < 1 &&
        !usersLoading &&
        foundRooms &&
        foundRooms?.findSuggestedChatRooms.length < 1 &&
        !roomsLoading && (
          <h3 style={{ textAlign: "center" }}>No results found</h3>
        )}

      <div className={styles.suggestedChats}>
        {data &&
          data.getSuggestedChatRooms.map((elem, index) => (
            <SuggestedChatRoom chatRoomWithImage={elem} key={index} />
          ))}
      </div>
    </div>
  );
};
export default ExploreContent;
