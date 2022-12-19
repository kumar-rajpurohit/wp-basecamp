/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from 'react';

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

/**
 * Mantine Components
 */

import {
    AppShell,
    Navbar,
    Header,
    Accordion,
    MantineProvider,
    Text,
    Title,
    Grid,
    Paper,
    Input,
    Checkbox,
    Button,
    Group,
    Space,
    Center,
    CloseButton,
    Skeleton,
    TextInput,
    Modal,
    Tabs,
    FileButton,
    Switch,
    Radio,
    NumberInput,
    MultiSelect,
    Loader,
    Divider,
    Container,
    Card,
    Image,
    Badge
} from '@mantine/core';

import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { showNotification, NotificationsProvider } from '@mantine/notifications';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { IconArrowLeft } from '@tabler/icons';

/**
 * React Beautiful DnD Components
 */
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */

export default function save() {
    const post_id = document.getElementsByClassName('wp-block-wisdm-central-message')[0].dataset.postId;
    const content = document.getElementsByClassName('wisdm-central-post-content')[0].innerHTML;

    const [users, setUserList] = useState([]);
    const [loading, setLoader] = useState(true);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link
        ],
        content
    });

    const message_data = useForm({
        initialValues: {
            category: null,
            title: '',
            description: ''
        }
    });

    useEffect(() => {
        // Get all users.
        apiFetch({
            path: 'wp/v2/users',
            method: 'GET'
        }).then((data) => {
            let user_list = [];
            data.map((user) => {
                user_list.push({
                    label: user.name,
                    value: user.id
                });
            })
            setUserList(user_list);
        });

        // Get message data.
        apiFetch({
            path: 'wp/v2/wdm-central-message/' + post_id,
            method: 'GET'
        }).then((data) => {
            message_data.setValues({
                title: data.title.rendered,
                project_id: data.acf.project,
                message_board_id: data["wisdm-central-message-category"]
            });

            // Get Project Name
            apiFetch({
                path: 'wp/v2/wdm-central-project/' + data.acf.project,
                method: 'GET'
            }).then((data) => {
                message_data.setValues({
                    project_title: data.title.rendered,
                    project_link: data.link
                })
                setLoader(false);
            });
        });

    }, []);

    const updateMessage = () => {
        setLoader(true);
        apiFetch({
            path: 'wp/v2/wdm-central-message/' + post_id,
            method: 'POST',
            data: {
                title: message_data.values.title,
                status: "publish",
                content: editor.getHTML(),
            }
        }).then((data) => {
            if (data.hasOwnProperty('id')) {
                showNotification({
                    title: 'Success !!',
                    message: 'Message Updated Successfully',
                })
            }
            setLoader(false);

        });
    }

    return (
        <MantineProvider theme={{ colorScheme: 'light' }}>
            <NotificationsProvider>
                <AppShell
                    padding="md"
                    header={<Header height={60} p="xs">
                        <Container>
                            <Grid>
                                <Grid.Col span={2}>
                                    <a href={"/message-board/?project=" + message_data.values.project_id}>
                                        <IconArrowLeft
                                            size={28}
                                            color={'black'}
                                        />
                                    </a>
                                </Grid.Col>
                                <Grid.Col span={8}>
                                    <Center>
                                        <Title order={2}>{message_data.values.project_title}</Title>
                                        {true === loading && (<Loader variant="bars" size="sm" />)}
                                    </Center>
                                </Grid.Col>
                                <Grid.Col span={2}>
                                    <Button onClick={updateMessage}>Update</Button>
                                </Grid.Col>
                            </Grid>
                        </Container>
                    </Header>}
                    styles={(theme) => ({
                        main: { backgroundColor: '#fffcf9' },
                    })}
                >
                    <Container size="sm" px="sm">
                        <Center p={"sm"}><Title order={2}>{message_data.values.title}</Title></Center>
                        <RichTextEditor editor={editor}>
                            <RichTextEditor.Toolbar sticky stickyOffset={60}>
                                <RichTextEditor.ControlsGroup>
                                    <RichTextEditor.Bold />
                                    <RichTextEditor.Italic />
                                    <RichTextEditor.Strikethrough />
                                    <RichTextEditor.ClearFormatting />
                                    <RichTextEditor.Code />
                                </RichTextEditor.ControlsGroup>

                                <RichTextEditor.ControlsGroup>
                                    <RichTextEditor.H1 />
                                    <RichTextEditor.H2 />
                                    <RichTextEditor.H3 />
                                    <RichTextEditor.H4 />
                                </RichTextEditor.ControlsGroup>

                                <RichTextEditor.ControlsGroup>
                                    <RichTextEditor.Blockquote />
                                    <RichTextEditor.Hr />
                                    <RichTextEditor.BulletList />
                                    <RichTextEditor.OrderedList />
                                </RichTextEditor.ControlsGroup>

                                <RichTextEditor.ControlsGroup>
                                    <RichTextEditor.Link />
                                    <RichTextEditor.Unlink />
                                </RichTextEditor.ControlsGroup>
                            </RichTextEditor.Toolbar>

                            <RichTextEditor.Content />
                        </RichTextEditor>
                    </Container>
                </AppShell>
            </NotificationsProvider>
        </MantineProvider>
    );
}

document.addEventListener("DOMContentLoaded", function (event) {

    let elem = document.getElementsByClassName('wisdm-central-container-message');
    if (elem.length > 0) {
        ReactDOM.render(React.createElement(save), elem[0]);
    }
    document.getElementById('wpadminbar').style.display = 'none';

});