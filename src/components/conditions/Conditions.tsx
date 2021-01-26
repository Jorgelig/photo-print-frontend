import React, { useState } from 'react';
import './conditions.css';
import { ConditionModel } from '../../models/search/Search';

interface ConditionProps {
    data?: ConditionModel[];
}

export const Conditions = (props: ConditionProps) => {

    return (
        <>
            {props.data === null ? '' : (
                props.data!.map(i => (
                    <>
                        {i.files.map(j => (
                            <img src={"http://halyk-wiki.cfp.corp.p-s.kz/file-server/" + j.name} style={{ maxWidth: '100%' }} />
                        ))}

                        <div className="long-description">
                        <div dangerouslySetInnerHTML={{ __html: i!.description }} />

                        </div>
                    </>
                ))
            )}


        </>

    )
}

