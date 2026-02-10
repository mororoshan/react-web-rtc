import React from "react";

export const MainPage = () => {
    const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return (
        <div>
            {array.map((arr) => (
                <div className="h-96">arr</div>
            ))}
        </div>
    );
};

export default MainPage;
